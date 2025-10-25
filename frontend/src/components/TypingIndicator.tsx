"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700/50 backdrop-blur-sm"
           style={{
             boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1) inset'
           }}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
