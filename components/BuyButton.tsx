'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BuyButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BuyButton({ className = '', size = 'md' }: BuyButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        boxShadow: "0 20px 40px -10px rgba(251, 191, 36, 0.4)"
      }}
      whileTap={{ 
        scale: 0.95,
        rotateY: 0,
        rotateX: 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link 
        href="/buy"
        className={`
          bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg 
          hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 
          shadow-lg hover:shadow-xl border-2 border-yellow-300
          relative overflow-hidden group inline-block
          ${sizeClasses[size]} ${className}
        `}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10">Get All 30 Prompts - $10</span>
      </Link>
    </motion.div>
  );
}

