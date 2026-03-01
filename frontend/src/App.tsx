import { useState } from 'react';
import { Users, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Component Imports
import { FileUploader } from './components/upload/FileUploader';
import { LimitSelector } from './components/upload/LimitSelector';
import { Button } from './components/ui/Button';
import { GlassCard } from './components/ui/GlassCard';
import { ResultsList } from './components/results/ResultsList';

const App = () => {
  // 1. STATE MANAGEMENT: Tracking inputs and server responses
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // 2. CORE ACTION: The logic that sends data to the AI
  const handleProcess = async () => {
    if (!jdFile || !resumes) return;

    setLoading(true);
    const formData = new FormData();
    
    // Prepare multi-part form data for file transmission
    formData.append('jd', jdFile);
    Array.from(resumes).forEach(file => formData.append('resumes', file));
    formData.append('limit', limit.toString());

    try {
      const { data } = await axios.post('http://localhost:5000/shortlist', formData);
      setResults(data);
    } catch (err) {
      console.error("API Error:", err);
      alert("Backend unreachable. Please ensure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // 3. UI VIEW: A single-frame "Dashboard" layout
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-200 p-6 font-sans">
      
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        
        {/* HEADER: Title and Branding */}
        <header className="mb-8 flex-shrink-0">
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            AI Resume Shortlister
          </motion.h1>
          <p className="text-slate-400 text-sm mt-1">Intelligent candidate ranking powered by LLMs</p>
        </header>

        {/* MAIN DASHBOARD: Split into Controls (Left) and Results (Right) */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">

          {/* CONTROL ASIDE: User Inputs */}
          <aside className="space-y-6 overflow-y-auto pr-2">
            <div>
              <Label text="Step 1: Requirements" />
              <FileUploader
                label="Job Description"
                icon={<FileText size={18} />}
                accept=".pdf"
                fileName={jdFile?.name}
                onChange={(f) => setJdFile(f?.[0] || null)}
                colorClass="text-cyan-400"
              />
            </div>

            <div>
              <Label text="Step 2: Candidate Pool" />
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <FileUploader
                  label="Upload Resumes"
                  icon={<Users size={18} />}
                  multiple
                  accept=".pdf"
                  fileName={resumes ? `${resumes.length} Files Selected` : undefined}
                  onChange={setResumes}
                  colorClass="text-purple-400"
                />
                <div className="mt-6 border-t border-white/5 pt-4">
                  <LimitSelector value={limit} onChange={setLimit} />
                  <Button
                    onClick={handleProcess}
                    loading={loading}
                    disabled={!jdFile || !resumes}
                    className="mt-4 w-full"
                  >
                    Start AI Analysis
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* RESULTS SECTION: AI Output with internal scrolling */}
          <section className="lg:col-span-2 min-h-0">
            <GlassCard className="h-full flex flex-col p-6 border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">Analysis Results</h2>
                {results.length > 0 && <Badge text="AI RANKED" />}
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ResultsList results={results} loading={loading} />
              </div>
            </GlassCard>
          </section>

        </main>
      </div>
    </div>
  );
};

/**
 * HELPER COMPONENTS (Internal to App.js for clarity)
 * These keep the main JSX tree clean and readable.
 */
const Label = ({ text }: { text: string }) => (
  <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">
    {text}
  </h3>
);

const Badge = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-bold">
    <Sparkles size={12} />
    {text}
  </div>
);

export default App;