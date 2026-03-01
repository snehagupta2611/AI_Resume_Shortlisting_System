import {NextFunction, Request, Response, Router} from 'express';
import multer from 'multer';
import {analyzeResume} from '../services/llm.js';
import {parsePDF} from '../services/parser.js';

const router = Router();

/**
 FILE UPLOAD CONFIGURATION
 We use memory storage to avoid writing sensitive resume data to disk.
 The 'cpUpload' middleware defines the expected fields:
 - 'jd': One Job Description PDF.
 - 'resumes': Up to 50 Resume PDFs.
 */
const storage = multer.memoryStorage();
const upload = multer({storage});

const cpUpload =
    upload.fields([{name: 'jd', maxCount: 1}, {name: 'resumes', maxCount: 50}]);

/**
 * EXTENDED TYPE DEFINITION
 * Extends the Express Request to tell TypeScript about the files
 * attached by the Multer middleware.
 */
interface MulterRequest extends Request {
  files: {jd?: Express.Multer.File[]; resumes?: Express.Multer.File[];};
}

/**
 * POST /
 * Primary endpoint for processing and ranking resumes against a Job
 * Description.
 */
router.post(
    '/',
    // MIDDLEWARE 1: Handle Multi-part Form Data (File Uploads)
    (req: Request, res: Response, next: NextFunction) => {
      cpUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({error: `Multer Error: ${err.message}`});
        } else if (err) {
          return res.status(500).json(
              {error: `Unknown Upload Error: ${err.message}`});
        }
        next();
      });
    },
    // MIDDLEWARE 2: Core Logic - Parse, Analyze, and Rank
    async (req: Request, res: Response) => {
      const multerReq = req as MulterRequest;

      console.log('--- Request Received ---');
      console.log('Files:', multerReq.files);
      console.log('Body:', req.body);

      try {
        // 1. VALIDATION: Ensure the Job Description is present
        if (!multerReq.files || !multerReq.files.jd) {
          return res.status(400).json(
              {error: 'Job Description (jd) file is missing in request'});
        }

        // 2. PARSING: Convert JD PDF buffer to raw text
        const jdText = await parsePDF(multerReq.files.jd[0].buffer);
        const resumeFiles = multerReq.files.resumes || [];

        if (resumeFiles.length === 0) {
          return res.status(400).json({error: 'No resumes uploaded'});
        }

        // Determine how many candidates to return (defaults to 5)
        const limit = parseInt(req.body.limit as string) || 5;

        // 3. ASYNC PROCESSING: Parse and Analyze all resumes in parallel
        const results = await Promise.all(resumeFiles.map(async (file) => {
          try {
            const text = await parsePDF(file.buffer);
            // The LLM service compares individual resume text against the JD
            // text
            return await analyzeResume(text, jdText);
          } catch (err) {
            console.error(`Error processing ${file.originalname}:`, err);
            return null;  // Gracefully handle individual file failures
          }
        }));

        // 4. CLEANING: Remove nulls from any resumes that failed to
        // parse/analyze
        const validResults = results.filter(r => r !== null);

        // 5. NORMALIZATION & RANKING: Calculate overall match scores
        const rankedResults = validResults.map(res => {
          /**
           * Calculate an average score across four dimensions.
           * Note: LLMs may return scores as decimals (0.8) or integers (80).
           * We normalize everything to a 0-100 scale.
           */
          const rawAvg = (res!.scores.exact + res!.scores.similarity +
                          res!.scores.impact + res!.scores.ownership) /
              4;

          const normalizedAvg = rawAvg <= 1 ? rawAvg * 100 : rawAvg;

          return {
            candidateName: res!.candidateName,
            overallMatch: Math.round(normalizedAvg),
            tier: res!.tier,
            explanation: res!.explanation,
            scores: res!.scores
          };
        });

        // 6. FINAL SORTING: Order by match percentage and apply the
        // user-defined limit
        const finalShortlist =
            rankedResults.sort((a, b) => b.overallMatch - a.overallMatch)
                .slice(0, limit);

        // 7. RESPONSE: Return the curated shortlist to the client
        res.json(finalShortlist);

      } catch (error: any) {
        console.error('Processing Error:', error);
        res.status(500).json({error: error.message || 'Analysis failed'});
      }
    });

export default router;