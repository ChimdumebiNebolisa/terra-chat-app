"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "@/components/ChatBubble";
import EventCard from "@/components/EventCard";
import TypingIndicator from "@/components/TypingIndicator";
import ThemeToggle from "@/components/ThemeToggle";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { useChat } from "@/hooks/useChat";
import { Event } from "@/types/event";

export default function Home() {
  const { messages, sendMessage, isLoading, clearChat } = useChat();
  const [input, setInput] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 300); // Reduced from 1000ms to 300ms for better UX

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    clearChat();
    setShowClearConfirm(false);
  };

  // Show loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <BackgroundAnimation />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">TerraChat</h2>
          <p className="text-slate-800 dark:text-slate-100">Loading natural event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundAnimation />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 animate-fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <ThemeToggle />
              <button
                onClick={handleClearChat}
                aria-label="Start a new conversation"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                New Chat
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-amber-500 bg-clip-text text-transparent mb-4 sm:mb-6">
            TerraChat
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-800 dark:text-slate-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Hi! How can I help you explore natural events around the world?
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div 
          className="glass-strong rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto" role="log" aria-label="Chat messages">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-blue-400 dark:text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Welcome to TerraChat!</h3>
                  <p className="text-slate-800 dark:text-slate-100 mb-6">Ask me about natural events happening around the world.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => setInput("What wildfires are currently active?")}
                    className="p-4 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors min-h-[44px] flex items-center justify-center"
                    aria-label="Ask about active wildfires"
                  >
                    🔥 Active wildfires
                  </button>
                  <button
                    onClick={() => setInput("Show me recent earthquakes")}
                    className="p-4 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors min-h-[44px] flex items-center justify-center"
                    aria-label="Ask about recent earthquakes"
                  >
                    🌍 Recent earthquakes
                  </button>
                  <button
                    onClick={() => setInput("What storms are happening?")}
                    className="p-4 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors min-h-[44px] flex items-center justify-center"
                    aria-label="Ask about current storms"
                  >
                    ⛈️ Current storms
                  </button>
                  <button
                    onClick={() => setInput("Tell me about recent floods")}
                    className="p-4 text-sm bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors min-h-[44px] flex items-center justify-center"
                    aria-label="Ask about recent floods"
                  >
                    🌊 Recent floods
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble
                      message={message.content}
                      isUser={message.role === "user"}
                      timestamp={message.timestamp}
                    />
                    {message.events && message.events.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.events.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about natural events around the world..."
              aria-label="Message input"
              aria-describedby="input-help character-count"
              maxLength={500}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-10 sm:pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 transition-all duration-300 text-base sm:text-lg placeholder-slate-700 dark:placeholder-slate-300"
              disabled={isLoading}
            />
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            {input.length > 400 && (
              <div className="absolute bottom-1 right-3 text-xs text-slate-700 dark:text-slate-300" id="character-count">
                {input.length}/500
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label={isLoading ? "Sending message" : "Send message"}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base sm:text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send"
            )}
          </button>
        </motion.form>
      </div>

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Clear Chat History?
            </h3>
          <p className="text-slate-800 dark:text-slate-100 mb-6">
            This will permanently delete all your messages. This action cannot be undone.
          </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Chat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}