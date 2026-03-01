import { motion } from 'framer-motion';

/**
 * COMPONENT PROPS
 * @param data - The individual candidate analysis object from our backend.
 * @param index - The position in the list (used to stagger animations).
 */
interface CandidateProps {
  data: any; // In a production app, we would use the 'AnalysisResult' interface here
  index: number;
}

export const CandidateCard = ({ data, index }: CandidateProps) => {
  /**
   * SCORE CALCULATION
   * We calculate the average of the four metrics to show a single 
   * "Match Percentage" at the top of the card.
   */
  const avgScore = Math.round(
    (data.scores.exact + 
     data.scores.similarity + 
     data.scores.impact + 
     data.scores.ownership) / 4
  );
  
  /**
   * DYNAMIC THEMING
   * Mapping the AI's "Tier" classification to specific Tailwind CSS classes.
   * This gives immediate visual feedback: Green for A, Amber for B, Red for C.
   */
  const tierColors: Record<string, string> = {
    "Tier A (Fast-track)": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    "Tier B (Technical Screen)": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    "Tier C (Needs Evaluation)": "bg-rose-500/20 text-rose-400 border border-rose-500/30"
  };

  return (
    /**
     * ANIMATION WRAPPER
     * initial/animate: The card slides in from the right (x: 20) and fades in.
     * transition: The 'delay' ensures cards appear one after another rather 
     * than all at once, creating a "waterfall" effect.
     */
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 mb-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all"
    >
      {/* HEADER SECTION: Name, Tier Badge, and Score */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{data.candidateName}</h3>
          
          {/* Dynamic Badge: Changes color based on the candidate's tier */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${tierColors[data.tier as keyof typeof tierColors]}`}>
            Tier {data.tier}
          </span>
        </div>
        
        {/* Large Score Display */}
        <div className="text-2xl font-black text-cyan-400">{avgScore}%</div>
      </div>

      {/* EXPLANATION SECTION: The AI's qualitative reasoning */}
      <p className="text-sm text-slate-400 italic">
        "{data.explanation}"
      </p>
    </motion.div>
  );
};