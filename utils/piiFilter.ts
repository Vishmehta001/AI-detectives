/**
 * PII (Personally Identifiable Information) Filter
 * 
 * This utility redacts sensitive information from messages before sending to the AI.
 * Protects student privacy by removing:
 * - Email addresses
 * - Phone numbers (various formats)
 */

/**
 * Regular expressions to match PII patterns
 */

// Matches email addresses (e.g., student@example.com)
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Matches various phone number formats:
// - (123) 456-7890
// - 123-456-7890
// - 123.456.7890
// - 1234567890
// - +1 123 456 7890
const PHONE_REGEX = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

/**
 * Redacts PII from a text string
 * @param text - The text to filter
 * @returns The text with PII replaced by [REDACTED]
 */
export function filterPII(text: string): string {
  // Replace emails with [REDACTED EMAIL]
  let filtered = text.replace(EMAIL_REGEX, '[REDACTED EMAIL]');
  
  // Replace phone numbers with [REDACTED PHONE]
  filtered = filtered.replace(PHONE_REGEX, '[REDACTED PHONE]');
  
  return filtered;
}

/**
 * Checks if text contains any PII
 * @param text - The text to check
 * @returns true if PII is detected, false otherwise
 */
export function containsPII(text: string): boolean {
  return EMAIL_REGEX.test(text) || PHONE_REGEX.test(text);
}
