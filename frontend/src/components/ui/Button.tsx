import { Loader2 } from 'lucide-react';

/**
 * COMPONENT PROPS
 * We extend the standard HTML Button attributes so this component
 * supports 'onClick', 'type', 'className', etc., out of the box.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;         // Shows a spinner and disables the button
  variant?: 'cyan' | 'purple'; // Controls the color theme
  children: React.ReactNode;   // The text or icons inside the button
}

export const Button = ({ 
  loading, 
  variant = 'cyan', 
  children, 
  ...props // "Rest" operator: gathers any other props like 'onClick' or 'type'
}: ButtonProps) => {

  /**
   * STYLE DICTIONARY
   * Instead of long if-else chains, we use an object to map 
   * variants to Tailwind gradient classes.
   */
  const variants = {
    cyan: "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20",
    purple: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/20"
  };

  return (
    <button 
      {...props} // Spreads all standard HTML attributes onto the button element
      // Prevent clicks if the button is currently loading or explicitly disabled
      disabled={loading || props.disabled}
      className={`
        w-full bg-linear-to-r ${variants[variant]} 
        disabled:from-slate-700 disabled:to-slate-800 
        py-3 rounded-xl font-bold shadow-lg transition-all 
        flex items-center justify-center gap-2 
        active:scale-[0.98] text-white
      `}
    >
      {/**
       * CONDITIONAL CONTENT
       * If 'loading' is true, we show the Lucide 'Loader2' icon with a spin animation.
       * Otherwise, we show the 'children' (the button text).
       */}
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        children
      )}
    </button>
  );
};