"use client";

import { useState, useEffect } from "react";
import { ChatMessage, Event } from "@/types/event";
import { api } from "@/lib/api";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("terrachat-messages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem("terrachat-messages");
      } catch (clearError) {
        console.error("Error clearing corrupted localStorage data:", clearError);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Limit messages to prevent localStorage overflow (keep last 50 messages)
        const messagesToSave = messages.slice(-50);
        localStorage.setItem("terrachat-messages", JSON.stringify(messagesToSave));
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
        // If localStorage is full, try to clear old messages and save recent ones
        try {
          const recentMessages = messages.slice(-25);
          localStorage.setItem("terrachat-messages", JSON.stringify(recentMessages));
        } catch (retryError) {
          console.error("Failed to save even reduced messages:", retryError);
          // Clear localStorage completely as last resort
          localStorage.removeItem("terrachat-messages");
        }
      }
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      role: "user",
      content: content.trim(),
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/api/chat", {
        message: content.trim(),
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.response,
        events: response.data.events,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorContent = "Sorry, I encountered an error. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('fetch')) {
          errorContent = "Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.message.includes('timeout')) {
          errorContent = "The request timed out. Please try again with a shorter message.";
        } else if (error.message.includes('500')) {
          errorContent = "Server error occurred. Please try again in a few moments.";
        } else if (error.message.includes('429')) {
          errorContent = "Too many requests. Please wait a moment before trying again.";
        }
      }
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: errorContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("terrachat-messages");
  };

  return {
    messages,
    sendMessage,
    isLoading,
    clearChat,
  };
}
