/**
 * Admin Dashboard Page
 * 
 * This page shows:
 * - List of all student IDs that have used the system
 * - Chat logs for each student
 * - Password protection (simple but effective for classroom use)
 * 
 * Features:
 * - Password entry screen
 * - Student ID list with chat counts
 * - Detailed chat log viewer
 * - Real-time data from Supabase
 */

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Simple password for admin access (in production, use proper authentication)
const ADMIN_PASSWORD = 'detective2024';

// TypeScript types for our data
type ChatLog = {
  id: string;
  student_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
};

type StudentSummary = {
  student_id: string;
  message_count: number;
  last_activity: string;
};

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Data state
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Handle password submission
   */
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Try again.');
      setPasswordInput('');
    }
  };

  /**
   * Fetch list of students and their activity
   */
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Query Supabase for student activity summary
      const { data, error } = await supabase
        .from('chat_logs')
        .select('student_id, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by student ID and count messages
      const studentMap = new Map<string, StudentSummary>();
      
      data?.forEach((log) => {
        const existing = studentMap.get(log.student_id);
        if (existing) {
          existing.message_count++;
          // Keep the most recent activity time
          if (new Date(log.created_at) > new Date(existing.last_activity)) {
            existing.last_activity = log.created_at;
          }
        } else {
          studentMap.set(log.student_id, {
            student_id: log.student_id,
            message_count: 1,
            last_activity: log.created_at,
          });
        }
      });

      // Convert map to array and sort by last activity
      const studentList = Array.from(studentMap.values()).sort(
        (a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
      );

      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch chat logs for a specific student
   */
  const fetchChatLogs = async (studentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setChatLogs(data || []);
      setSelectedStudent(studentId);
    } catch (error) {
      console.error('Error fetching chat logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
    }
  }, [isAuthenticated]);

  // Password Entry Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full border-2 border-terminal-border bg-terminal-surface rounded-lg p-8">
          <h1 className="text-2xl font-bold text-terminal-accent mb-2">
            🔒 ADMIN ACCESS
          </h1>
          <p className="text-terminal-text-dim mb-6">
            Enter password to view dashboard
          </p>
          
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-terminal-bg border-2 border-terminal-border rounded px-4 py-2 text-terminal-text placeholder-terminal-text-dim focus:outline-none focus:border-terminal-accent mb-4"
              autoFocus
            />
            
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            
            <button
              type="submit"
              className="w-full px-6 py-2 bg-terminal-border border-2 border-terminal-text-secondary text-terminal-text rounded hover:bg-terminal-text-dim hover:text-terminal-bg transition-colors font-bold"
            >
              LOGIN
            </button>
          </form>
          
          <p className="text-terminal-text-dim text-xs mt-4">
            Default password: detective2024
          </p>
        </div>
      </main>
    );
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen bg-terminal-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-2 border-terminal-border bg-terminal-surface rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-terminal-accent mb-1">
                📊 ADMIN DASHBOARD
              </h1>
              <p className="text-terminal-text-dim text-sm">
                Student Activity & Chat Logs
              </p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-terminal-border border-2 border-terminal-text-secondary text-terminal-text rounded hover:bg-terminal-text-dim hover:text-terminal-bg transition-colors font-bold text-sm"
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student List */}
          <div className="border-2 border-terminal-border bg-terminal-surface rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-terminal-text">Students</h2>
              <button
                onClick={fetchStudents}
                disabled={loading}
                className="text-terminal-accent hover:text-terminal-text-secondary text-sm"
              >
                {loading ? 'Loading...' : '↻ Refresh'}
              </button>
            </div>

            {students.length === 0 ? (
              <p className="text-terminal-text-dim text-sm">
                No student activity yet
              </p>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <button
                    key={student.student_id}
                    onClick={() => fetchChatLogs(student.student_id)}
                    className={`w-full text-left p-3 rounded border-2 transition-colors ${
                      selectedStudent === student.student_id
                        ? 'border-terminal-accent bg-terminal-border'
                        : 'border-terminal-border hover:border-terminal-text-secondary'
                    }`}
                  >
                    <div className="font-bold text-terminal-text">
                      {student.student_id}
                    </div>
                    <div className="text-xs text-terminal-text-dim">
                      {student.message_count} messages
                    </div>
                    <div className="text-xs text-terminal-text-dim">
                      Last: {new Date(student.last_activity).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Logs */}
          <div className="md:col-span-2 border-2 border-terminal-border bg-terminal-surface rounded-lg p-4">
            <h2 className="text-lg font-bold text-terminal-text mb-4">
              {selectedStudent ? `Chat Logs - ${selectedStudent}` : 'Chat Logs'}
            </h2>

            {!selectedStudent ? (
              <p className="text-terminal-text-dim text-sm">
                Select a student to view their chat history
              </p>
            ) : (
              <div className="h-[600px] overflow-y-auto terminal-scrollbar space-y-4">
                {chatLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded border-2 ${
                      log.role === 'user'
                        ? 'border-terminal-text bg-terminal-border'
                        : 'border-terminal-text-secondary bg-terminal-bg'
                    }`}
                  >
                    <div className="text-xs text-terminal-text-dim mb-1">
                      [{log.role.toUpperCase()}] {new Date(log.created_at).toLocaleString()}
                    </div>
                    <div className={log.role === 'user' ? 'text-terminal-text' : 'text-terminal-text-secondary'}>
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
