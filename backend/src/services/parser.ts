import pdf from 'pdf-parse';

/**
 * parsePDF
 * Extracts raw text from a PDF file buffer.
 * @param buffer - The binary data of the uploaded PDF (from Multer memory storage).
 * @returns A cleaned, single-line string of the PDF content.
 * @throws Error if the PDF is corrupt or unreadable.
 */
export const parsePDF = async (buffer: Buffer): Promise<string> => {
  try {
    // 1. EXTRACTION: pdf-parse reads the buffer and extracts text layers.
    const data = await pdf(buffer);

    /**
     * 2. CLEANING (Normalization):
     * PDFs often contain weird formatting, many newlines (\n), and excessive tabs (\t).
     * * .replace(/\s+/g, ' ') -> Finds all sequences of whitespace and replaces them with a single space.
     * .trim() -> Removes any leading or trailing spaces.
     * * WHY: This reduces "token usage" for the LLM and prevents formatting noise from 
     * confusing the analysis logic.
     */
    const cleanedText = data.text.replace(/\s+/g, ' ').trim();

    return cleanedText;
    
  } catch (error) {
    // 3. ERROR HANDLING: Logs the specific error for debugging but throws a user-friendly message.
    console.error('PDF Parsing Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};