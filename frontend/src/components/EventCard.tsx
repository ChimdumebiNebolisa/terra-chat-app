"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      wildfires: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200 dark:shadow-red-900/30",
      volcanoes: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200 dark:shadow-orange-900/30",
      floods: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/30",
      storms: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/30",
      earthquakes: "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-yellow-200 dark:shadow-yellow-900/30",
      droughts: "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-amber-200 dark:shadow-amber-900/30",
      landslides: "bg-gradient-to-r from-stone-500 to-stone-600 text-white shadow-stone-200 dark:shadow-stone-900/30",
      snow: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-cyan-200 dark:shadow-cyan-900/30",
      ice: "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sky-200 dark:shadow-sky-900/30",
      dust: "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-amber-200 dark:shadow-amber-900/30",
      manmade: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200 dark:shadow-gray-900/30",
    };
    return colors[category.toLowerCase()] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200 dark:shadow-gray-900/30";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${event.title} - Click to ${isExpanded ? 'collapse' : 'expand'} details`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 leading-tight">
            {event.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((category) => (
              <motion.span
                key={category.id}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getCategoryColor(category.title)}`}
              >
                {category.title}
              </motion.span>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-slate-700 dark:text-slate-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {event.geometries && event.geometries.length > 0 && event.geometries[0] && event.geometries[0].date && formatDate(event.geometries[0].date)}
            {event.closed && (
              <span className="ml-3 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                Closed: {formatDate(event.closed)}
              </span>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4">
          {event.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Description
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
          
          {event.geometries && event.geometries.length > 0 && event.geometries[0] && event.geometries[0].coordinates && event.geometries[0].coordinates.length >= 2 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-mono">
                {event.geometries[0].coordinates[1]?.toFixed(4) || 'N/A'}, {event.geometries[0].coordinates[0]?.toFixed(4) || 'N/A'}
              </p>
            </div>
          )}
          
          {event.sources.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Sources
              </h4>
              <div className="space-y-2">
                {event.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block break-all"
                  >
                    {source.url}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {event.link && (
            <div className="pt-2">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Details
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
