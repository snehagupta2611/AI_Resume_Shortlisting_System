import { motion, AnimatePresence } from 'framer-motion';
import { CandidateCard } from './CandidateCard';
import { AlertCircle } from 'lucide-react';

/**
 * COMPONENT PROPS
 * @param results - An array of analyzed candidate objects from the API.
 * @param loading - A boolean flag indicating if the backend is currently processing.
 */
interface ResultsListProps {
  results: any[];
  loading: boolean;
}

export const ResultsList = ({ results, loading }: ResultsListProps) => {
  return (
    <div className="space-y-4">
      {/**
       * ANIMATION WRAPPER (AnimatePresence)
       * This allows components to animate *out* when they are removed from the DOM.
       * 'popLayout' prevents the list from "snapping" instantly when items change.
       */}
      <AnimatePresence mode="popLayout">
        
        {/* CASE 1: EMPTY STATE
            If there are no results and we aren't currently loading, show the placeholder.
        */}
        {results.length === 0 && !loading ? (
          <motion.div 
            key="empty-state" // Key is required for AnimatePresence to track the element
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl"
          >
            {/* Visual Icon from Lucide-React */}
            <AlertCircle size={48} className="mb-4 opacity-20" />
            
            <p className="font-medium">Waiting for analysis...</p>
            <p className="text-sm opacity-60">
              Upload files and click process to start.
            </p>
          </motion.div>
        ) : (
          
          /* CASE 2: RESULTS STATE
             Map through the results array and render a CandidateCard for each entry.
          */
          results.map((item, idx) => (
            <CandidateCard 
              key={item.candidateName || idx} // Prefer unique names over index for better React performance
              data={item} 
              index={idx} 
            />
          ))
        )}

      </AnimatePresence>
    </div>
  );
};