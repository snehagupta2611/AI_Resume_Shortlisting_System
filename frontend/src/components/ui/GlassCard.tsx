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
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
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