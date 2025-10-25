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

  // Generate 20+ particles with varied properties
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: (i * 13 + 5) % 100,
      top: (i * 17 + 10) % 100,
      duration: 3 + (i % 4) * 0.5,
      delay: (i % 5) * 0.3,
      size: 1 + (i % 3) * 0.5,
      colorClass: i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-amber-400',
    }));
  }, []);

  // Generate shooting stars
  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      left: i * 30 + 10,
      top: i * 25 + 15,
      duration: 3 + i * 0.5,
      delay: i * 2,
    }));
  }, []);

  // Generate nebula clouds
  const nebulaClouds = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: (i * 20 + 15) % 100,
      top: (i * 25 + 20) % 100,
      duration: 15 + i * 2,
      delay: i * 2,
    }));
  }, []);

  // Generate constellation patterns
  const constellations = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      left: (i * 30 + 20) % 100,
      top: (i * 30 + 15) % 100,
      rotation: i * 30,
    }));
  }, []);

  // Generate pulsing glow effects
  const pulsingGlows = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: (i * 15 + 10) % 100,
      top: (i * 18 + 15) % 100,
      duration: 4 + i * 0.5,
      delay: i * 0.8,
    }));
  }, []);

  // Generate floating event icons
  const eventIcons = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      icon: ['🔥', '🌊', '⛈️', '🌋', '🌍', '🌟'][i],
      left: (i * 16 + 8) % 100,
      top: (i * 14 + 12) % 100,
      duration: 5 + i * 0.7,
      delay: i * 0.5,
    }));
  }, []);

  if (!mounted) return null;

  // If user prefers reduced motion, show static background
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-20">
          <div className="w-full h-full rounded-full border-2 border-blue-400 relative">
            <div className="absolute inset-2 rounded-full border border-green-400 opacity-50"></div>
            <div className="absolute inset-4 rounded-full border border-amber-400 opacity-30"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Earth/Globe */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full border-2 border-blue-400 relative">
          <div className="absolute inset-2 rounded-full border border-green-400 opacity-50"></div>
          <div className="absolute inset-4 rounded-full border border-amber-400 opacity-30"></div>
        </div>
      </motion.div>

      {/* Enhanced orbital rings - increased from 2 to 5 */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-48 h-48 border border-blue-600 rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/3 w-64 h-64 border border-green-600 rounded-full opacity-15"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-80 h-80 border border-amber-600 rounded-full opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-96 h-96 border border-purple-600 rounded-full opacity-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-[28rem] h-[28rem] border border-cyan-600 rounded-full opacity-5"
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      />

      {/* Enhanced floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.colorClass} rounded-full`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars/meteors */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-20 bg-gradient-to-b from-white via-blue-300 to-transparent opacity-60"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            transform: 'rotate(45deg)',
          }}
          animate={{
            x: [0, 500],
            y: [0, 500],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Nebula clouds */}
      {nebulaClouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute w-40 h-40 rounded-full opacity-10"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Constellation patterns */}
      {constellations.map((constellation) => (
        <motion.div
          key={constellation.id}
          className="absolute opacity-30"
          style={{
            left: `${constellation.left}%`,
            top: `${constellation.top}%`,
            transform: `rotate(${constellation.rotation}deg)`,
          }}
          animate={{ rotate: constellation.rotation + 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="20" cy="20" r="2" fill="currentColor" className="text-blue-300" />
            <circle cx="60" cy="20" r="2" fill="currentColor" className="text-green-300" />
            <circle cx="40" cy="60" r="2" fill="currentColor" className="text-amber-300" />
            <line x1="20" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="1" className="text-blue-400 opacity-50" />
            <line x1="20" y1="20" x2="40" y2="60" stroke="currentColor" strokeWidth="1" className="text-green-400 opacity-50" />
            <line x1="60" y1="20" x2="40" y2="60" stroke="currentColor" strokeWidth="1" className="text-amber-400 opacity-50" />
          </svg>
        </motion.div>
      ))}

      {/* Pulsing glow effects */}
      {pulsingGlows.map((glow) => (
        <motion.div
          key={glow.id}
          className="absolute w-24 h-24 rounded-full opacity-20"
          style={{
            left: `${glow.left}%`,
            top: `${glow.top}%`,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: glow.duration,
            repeat: Infinity,
            delay: glow.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating event icons */}
      {eventIcons.map((event) => (
        <motion.div
          key={event.id}
          className="absolute text-2xl opacity-30"
          style={{
            left: `${event.left}%`,
            top: `${event.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: event.duration,
            repeat: Infinity,
            delay: event.delay,
            ease: "easeInOut",
          }}
        >
          {event.icon}
        </motion.div>
      ))}

      {/* Enhanced wave patterns */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional atmospheric layers */}
      <motion.div
        className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent"
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
