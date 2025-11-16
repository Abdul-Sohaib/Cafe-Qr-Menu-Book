import { motion } from 'framer-motion';
import { useEffect } from 'react';
import logo from '../assets/Logo.png';

interface LogoFadeAnimationProps {
  onComplete: () => void;
}

const LogoFadeAnimation: React.FC<LogoFadeAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // total animation time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-[#FBEEDE] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 5.5,
        ease: [0.45, 0, 0.55, 1], // smoother cubic-bezier
        times: [0, 0.2, 0.8, 1],
      }}
    >
      <motion.img
        src={logo}
        alt="7 Gramm Cafe Logo"
        className="w-40 h-40 object-contain drop-shadow-2xl bg-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [1, 1.2, 2, 2.6], // smooth continuous zoom
        }}
        transition={{
          duration: 5.5,
          ease: [0.45, 0, 0.55, 1], // smooth curve, no sudden jumps
          times: [0, 0.2, 0.8, 1],
        }}
      />
    </motion.div>
  );
};

export default LogoFadeAnimation;
