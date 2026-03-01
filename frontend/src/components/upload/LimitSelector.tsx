/**
 * COMPONENT PROPS
 * @param value - The current numeric limit stored in the parent's state.
 * @param onChange - Callback to update the parent's state when the user types.
 */
interface LimitSelectorProps {
  value: number;
  onChange: (val: number) => void;
}

export const LimitSelector = ({ value, onChange }: LimitSelectorProps) => {
  return (
    <div className="mt-4">
      {/* LABEL: A subtle, high-contrast header for the input field */}
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
        Shortlist Limit
      </label>

      {/**
       * NUMERIC INPUT:
       * - min/max: Prevents the user from requesting 0 or 1,000s of candidates 
       * at once, which protects the LLM from being overloaded.
       * - Number(e.target.value): Vital step to ensure the data stays a 'number' type 
       * since HTML input values are always strings by default.
       */}
      <input 
        type="number" 
        min="1"
        max="100"
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        /**
         * STYLING:
         * - bg-black/40: Creates a "recessed" look, making it look different from the cards.
         * - focus:ring-2: Adds a glowing cyan border when the user clicks inside.
         * - font-mono: Makes the numbers look like "data," which fits the technical theme.
         */
        className="
          w-full bg-black/40 border border-white/10 
          rounded-lg px-4 py-2.5 text-white 
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
          transition-all font-mono
        "
      />
    </div>
  );
};