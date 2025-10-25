"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-xs lg:max-w-lg px-6 py-4 rounded-2xl shadow-lg group relative ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
            : "bg-white/95 dark:bg-gray-800/95 text-slate-900 dark:text-slate-100 rounded-bl-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap pr-8">{message}</p>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser 
              ? "text-white hover:text-blue-50 hover:bg-blue-800/50" 
              : "text-slate-700 dark:text-slate-100 hover:text-slate-800 dark:hover:text-slate-50 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          aria-label={copied ? "Copied!" : "Copy message"}
          title={copied ? "Copied!" : "Copy message"}
        >
          {copied ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
        
        {/* Message timestamp */}
        <div className={`text-xs mt-2 opacity-70 ${
          isUser ? "text-blue-50" : "text-slate-700 dark:text-slate-200"
        }`}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.div>
    </motion.div>
  );
}
