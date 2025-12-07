/**
 * Student ID Utility Functions
 * 
 * These functions handle:
 * - Generating a random student ID
 * - Storing/retrieving the ID from localStorage
 * - Managing the student's identity throughout the session
 */

/**
 * Generates a random 6-character alphanumeric student ID
 * Format: ABC123 (3 uppercase letters + 3 numbers)
 */
export function generateStudentId(): string {
  // Generate 3 random uppercase letters (A-Z)
  const letters = Array.from({ length: 3 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  
  // Generate 3 random numbers (0-9)
  const numbers = Array.from({ length: 3 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  
  return `${letters}${numbers}`;
}

/**
 * Gets the student ID from localStorage or generates a new one
 * This ensures each student has a persistent ID during their session
 */
export function getOrCreateStudentId(): string {
  // Check if we're running in the browser (not during server-side rendering)
  if (typeof window === 'undefined') {
    return ''; // Return empty string during SSR
  }
  
  // Try to get existing student ID from localStorage
  let studentId = localStorage.getItem('studentId');
  
  // If no ID exists, generate a new one and save it
  if (!studentId) {
    studentId = generateStudentId();
    localStorage.setItem('studentId', studentId);
  }
  
  return studentId;
}

/**
 * Clears the student ID (useful for testing or resetting)
 */
export function clearStudentId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('studentId');
  }
}
