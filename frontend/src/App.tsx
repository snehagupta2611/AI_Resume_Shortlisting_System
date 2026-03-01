import { useState } from 'react';
import { Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Component Imports
import { FileUploader } from './components/upload/FileUploader';
import { LimitSelector } from './components/upload/LimitSelector';
import { Button } from './components/ui/Button';
import { GlassCard } from './components/ui/GlassCard';
import { ResultsList } from './components/results/ResultsList';

const App = () => {
  /**
   * APPLICATION STATE
   * These hooks track the lifecycle of the user's interaction.
   */
  const [jdFile, setJdFile] = useState<File | null>(null);      // The Job Description PDF
  const [resumes, setResumes] = useState<FileList | null>(null); // The array of Resume PDFs
  const [limit, setLimit] = useState(5);                         // How many candidates to return
  const [loading, setLoading] = useState(false);                 // UI loading state
  const [results, setResults] = useState<any[]>([]);             // Data returned from the AI

  /**
   * CORE LOGIC: handleProcess
   * This function prepares the files for transport and sends them to the backend.
   */
  const handleProcess = async () => {
    // 1. Guard Clause: Don't run if files are missing
    if (!jdFile || !resumes) return;

    setLoading(true);   
    
    /**
     * 2. DATA PREPARATION
     * Since we are sending binary files (PDFs), we must use 'FormData' 
     * instead of a standard JSON object.
     */
    const formData = new FormData();
    formData.append('jd', jdFile);
    // Convert FileList to an Array to loop through and append each resume
    Array.from(resumes).forEach(file => formData.append('resumes', file));
    formData.append('limit', limit.toString());

    try {
      // 3. API CALL: Sending the data to our Express /shortlist endpoint
      const response = await axios.post('http://localhost:5000/shortlist', formData);
      
      // 4. UPDATE UI: Store the AI-ranked results in state to trigger a re-render
      setResults(response.data);
    } catch (err) {
      console.error("Shortlisting error:", err);
      alert("Failed to process resumes. Ensure the backend is running.");
    } finally {
      // 5. CLEANUP: Stop the loading spinner regardless of success or failure
      setLoading(false);
    }
  };

  return (
    // MAIN WRAPPER: Implements the dark theme and radial gradient background
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION: Animated title using Framer Motion */}
        <header className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500 mb-2"
          >
            AI Resume Shortlister
          </motion.h1>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Input Controls (Uploaders and Selectors) */}
          <div className="space-y-6">
            <FileUploader
              label="Job Description"
              icon={<FileText />}
              accept=".pdf"
              fileName={jdFile?.name}
              onChange={(f) => setJdFile(f?.[0] || null)}
              colorClass="text-cyan-400"
            />

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <FileUploader
                label="Candidate Pool"
                icon={<Users />}
                multiple
                accept=".pdf"
                fileName={resumes ? `${resumes.length} Resumes Selected` : undefined}
                onChange={setResumes}
                colorClass="text-purple-400"
              />

              <LimitSelector value={limit} onChange={setLimit} />

              <Button
                onClick={handleProcess}
                loading={loading}
                disabled={!jdFile || !resumes} // Visual feedback: Button is greyed out until files are ready
                className="mt-6"
              >
                Process Shortlist
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Visualization */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8 min-h-150">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                Analysis Results
                {results.length > 0 && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full uppercase tracking-wider font-medium">
                    AI Sorted
                  </span>
                )}
              </h2>
              
              {/* This component handles the empty state and the list of result cards */}
              <ResultsList results={results} loading={loading} />
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;