/**
 * COMPONENT PROPS
 * @param label - The name of the metric (e.g., "Exact Match", "Impact").
 * @param value - The percentage score (0-100) to display.
 */
interface ProgressBarProps {
  label: string;
  value: number;
}

export const ProgressBar = ({ label, value }: ProgressBarProps) => (
  <div className="mb-2">
    {/* METADATA ROW: Displays the category name and the numerical percentage */}
    <div className="flex justify-between text-[10px] uppercase text-slate-500 mb-1 font-bold tracking-wider">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    {/* PROGRESS TRACK: The background "trough" of the bar */}
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      
      {/**
       * PROGRESS FILL: The actual colored indicator
       * - duration-1000: This makes the bar "grow" smoothly over 1 second 
       * when the data first loads.
       * - style={{ width: `${value}%` }}: We use a dynamic inline style 
       * because Tailwind classes cannot easily represent every single 
       * percentage (1-100) dynamically.
       */}
      <div 
        className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);