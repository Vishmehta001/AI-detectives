/**
 * Main Chat Page Component
 * 
 * This is the main page of the AI Detective game.
 * Features:
 * - Detective Terminal themed UI (dark with green text)
 * - Chat interface for students to interact with the AI
 * - Automatic student ID generation and storage
 * - Real-time streaming responses from the AI
 */

'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { getOrCreateStudentId } from '@/utils/studentId';

export default function Home() {
  // State for the student ID
  const [studentId, setStudentId] = useState<string>('');
  
  // useChat hook from Vercel AI SDK handles:
  // - Message state management
  // - Sending messages to the API
  // - Receiving streaming responses
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    // Include student ID with each request
    body: {
      studentId,
    },
  });

  // Get or create student ID when component mounts
  useEffect(() => {
    const id = getOrCreateStudentId();
    setStudentId(id);
  }, []);

  return (
    <main className="min-h-screen bg-terminal-bg p-4">
      {/* Terminal Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="border-2 border-terminal-border bg-terminal-surface rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-terminal-accent mb-1">
                🔍 AI DETECTIVE TERMINAL
              </h1>
              <p className="text-terminal-text-dim text-sm">
                Solve mysteries with artificial intelligence
              </p>
            </div>
            {/* Display Student ID */}
            {studentId && (
              <div className="text-right">
                <p className="text-terminal-text-dim text-xs">AGENT ID:</p>
                <p className="text-terminal-accent font-bold">{studentId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="border-2 border-terminal-border bg-terminal-surface rounded-lg p-4 mb-4 h-[500px] overflow-y-auto terminal-scrollbar">
          {/* Welcome Message (shown when no messages) */}
          {messages.length === 0 && (
            <div className="text-terminal-text-dim">
              <p className="mb-4">{'>'} SYSTEM INITIALIZED...</p>
              <p className="mb-4">{'>'} WELCOME TO THE AI DETECTIVE TERMINAL</p>
              <p className="mb-4">
                {'>'} Your mission: Work with the AI to solve mysterious cases.
              </p>
              <p>{'>'} Type your first message to begin...</p>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'user' 
                  ? 'text-terminal-text' 
                  : 'text-terminal-text-secondary'
              }`}
            >
              {/* Message Header */}
              <div className="text-xs text-terminal-text-dim mb-1">
                {message.role === 'user' ? `[AGENT ${studentId}]` : '[AI DETECTIVE]'}
              </div>
              
              {/* Message Content */}
              <div className="pl-4 border-l-2 border-terminal-border">
                {message.content}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-terminal-accent animate-pulse">
              {'>'} AI Detective is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-2 border-terminal-border bg-terminal-surface rounded-lg p-4">
          <div className="flex gap-2">
            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-terminal-bg border-2 border-terminal-border rounded px-4 py-2 text-terminal-text placeholder-terminal-text-dim focus:outline-none focus:border-terminal-accent disabled:opacity-50"
            />
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-terminal-border border-2 border-terminal-text-secondary text-terminal-text rounded hover:bg-terminal-text-dim hover:text-terminal-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {isLoading ? 'SENDING...' : 'SEND'}
            </button>
          </div>
          
          {/* Helper Text */}
          <p className="text-terminal-text-dim text-xs mt-2">
            Press Enter to send • Tip: Ask the detective about a mystery!
          </p>
        </form>
      </div>
    </main>
  );
}
