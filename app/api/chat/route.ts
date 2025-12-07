/**
 * Chat API Route
 * 
 * This API endpoint handles chat requests from students.
 * It:
 * 1. Receives messages from the frontend
 * 2. Filters out PII (emails, phone numbers)
 * 3. Sends the message to OpenAI's API
 * 4. Logs the conversation to Supabase
 * 5. Streams the response back to the client
 * 
 * This uses the Vercel AI SDK which makes it easy to:
 * - Stream AI responses in real-time
 * - Handle the OpenAI API connection
 * - Manage conversation state
 */

import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { filterPII } from '@/utils/piiFilter';
import { supabase } from '@/lib/supabase';

// Create OpenAI API client
// The API key is loaded from environment variables
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Allow streaming responses up to 30 seconds
export const runtime = 'edge';

/**
 * POST handler for chat messages
 */
export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { messages, studentId } = await req.json();

    // Validate that we have messages
    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    // Get the last message (the user's current message)
    const lastMessage = messages[messages.length - 1];
    
    // Filter PII from the user's message before sending to OpenAI
    const filteredContent = filterPII(lastMessage.content);
    
    // Create a new messages array with the filtered content
    const filteredMessages = [
      ...messages.slice(0, -1),
      { ...lastMessage, content: filteredContent }
    ];

    // Log the user's message to Supabase (with original content for admin review)
    if (studentId) {
      try {
        await supabase.from('chat_logs').insert({
          student_id: studentId,
          message: lastMessage.content, // Store original for admin
          role: 'user',
        });
      } catch (error) {
        // Log error but don't fail the request
        console.error('Error logging to Supabase:', error);
      }
    }

    // System prompt that defines the AI's role as a detective game master
    const systemMessage = {
      role: 'system',
      content: `You are the AI Detective Game Master. You present students with mystery scenarios and help them solve cases by:
- Providing clues and evidence
- Answering questions about the case
- Guiding their detective reasoning
- Being encouraging and educational
- Keeping responses concise and engaging

The game is designed for classroom use, so keep content appropriate and educational.`
    };

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo-preview', // Use GPT-4 Turbo for best results
      messages: [systemMessage, ...filteredMessages],
      temperature: 0.7, // Some creativity but not too random
      max_tokens: 500, // Keep responses concise
      stream: true, // Enable streaming
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // Log the AI's response to Supabase after it's complete
        if (studentId) {
          try {
            await supabase.from('chat_logs').insert({
              student_id: studentId,
              message: completion,
              role: 'assistant',
            });
          } catch (error) {
            console.error('Error logging AI response to Supabase:', error);
          }
        }
      },
    });

    // Return the streaming response to the client
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
