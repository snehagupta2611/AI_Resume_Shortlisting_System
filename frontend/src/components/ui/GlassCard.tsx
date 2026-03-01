import { motion } from 'framer-motion';

/**
 * COMPONENT PROPS
 * @param children - Any React elements (forms, lists, text) to be rendered inside the card.
 * @param className - Optional extra CSS classes to adjust margins, padding, or width.
 */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => (
  /**
   * ANIMATION ENGINE (Framer Motion)
   * initial: The card starts slightly smaller (95%) and invisible.
   * animate: It smoothly "pops" into full size and visibility when the page loads.
   */
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    /**
     * GLASSMORPHISM STYLING
     * bg-white/5: A very subtle, transparent white background.
     * backdrop-blur-xl: The "frosted glass" effect that blurs elements behind the card.
     * border-white/10: A thin, semi-transparent border to catch the light.
     * shadow-2xl: A deep shadow to give the card "depth" and lift it off the page.
     */
    className={`
      bg-white/5 
      backdrop-blur-xl 
      border border-white/10 
      rounded-2xl 
      shadow-2xl 
      ${className}
    `}
  >
    {children}
  </motion.div>
);