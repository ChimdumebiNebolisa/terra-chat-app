"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate stable particle positions and animations (reduced from 12 to 6 for better performance)
  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: (i * 15 + 15) % 100, // Distribute particles evenly
      top: (i * 20 + 20) % 100,
      duration: 3 + (i % 3) * 0.5, // 3, 3.5, 4 seconds
      delay: (i % 3) * 0.5, // 0, 0.5, 1 seconds
      size: i % 2 === 0 ? 1.5 : 1, // Vary sizes
    }));
  }, []);

  if (!mounted) return null;

  // If user prefers reduced motion, show static background
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10 dark:opacity-20">
          <div className="w-full h-full rounded-full border-2 border-blue-300 dark:border-blue-400 relative">
            <div className="absolute inset-2 rounded-full border border-green-300 dark:border-green-400 opacity-50"></div>
            <div className="absolute inset-4 rounded-full border border-amber-300 dark:border-amber-400 opacity-30"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Earth/Globe */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10 dark:opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full border-2 border-blue-300 dark:border-blue-400 relative">
          {/* Continental outlines */}
          <div className="absolute inset-2 rounded-full border border-green-300 dark:border-green-400 opacity-50"></div>
          <div className="absolute inset-4 rounded-full border border-amber-300 dark:border-amber-400 opacity-30"></div>
        </div>
      </motion.div>

      {/* Orbital rings */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-48 h-48 border border-blue-200 dark:border-blue-600 rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/3 w-64 h-64 border border-green-200 dark:border-green-600 rounded-full opacity-15"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles representing global events */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute bg-blue-400 dark:bg-blue-300 rounded-full`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle wave patterns */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50 dark:from-blue-900/20 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional floating elements */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full opacity-40"
        animate={{
          x: [0, 30, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-amber-400 dark:bg-amber-300 rounded-full opacity-50"
        animate={{
          x: [0, -20, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}
