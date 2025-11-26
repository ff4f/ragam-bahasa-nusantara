import { motion } from "framer-motion";

interface HamburgerButtonProps {
  isOpen: boolean;
  toggle: () => void;
  className?: string
}

const HamburgerButton = ({ isOpen, toggle, className }: HamburgerButtonProps) => {
  return (
    <button
      onClick={toggle}
      className={`relative w-8 h-8 flex flex-col justify-center items-center space-y-1 ${className || ""}`}
    >
      {/* Top line */}
      <motion.span
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block w-8 h-[2px] bg-primary rounded-full origin-center"
      />

      {/* Middle line */}
      <motion.span
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="block w-8 h-[2px] bg-primary rounded-full origin-center"
      />

      {/* Bottom line */}
      <motion.span
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block w-8 h-[2px] bg-primary rounded-full origin-center"
      />
    </button>
  );
};

export default HamburgerButton;
