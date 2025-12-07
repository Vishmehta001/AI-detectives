# 🎯 Features Documentation

## Overview

The AI Detective Game is a classroom-friendly application that allows students to interact with an AI detective to solve mysteries, while teachers can monitor conversations and ensure appropriate use.

## 🖥️ Frontend Features

### Detective Terminal Theme

**Design Philosophy**
- Dark background with bright green text (terminal aesthetic)
- Monospace font for coding/hacking feel
- Minimalist interface to focus on conversation
- Responsive design works on desktop and mobile

**Color Scheme**
- Background: Very dark green/black (#0a0e0a)
- Primary Text: Bright green (#00ff41)
- Secondary Text: Medium green (#00cc33)
- Borders: Dark green (#1a2618)
- Accents: Neon green (#39ff14)

### Random Student ID Generation

**How It Works**
- When a student first visits, a random ID is generated
- Format: 3 uppercase letters + 3 numbers (e.g., ABC123)
- Stored in browser's localStorage
- Persists across sessions
- No login required

**Technical Details**
```javascript
// Example ID generation
const letters = 'DEF'  // Random A-Z
const numbers = '456'   // Random 0-9
const studentId = 'DEF456'
```

**Benefits**
- No registration friction
- Privacy-friendly (no personal info collected)
- Easy to reference in class ("ABC123, can you share your answer?")
- Persistent identity for tracking learning progress

### Chat Interface

**Key Features**
1. **Real-time Streaming**
   - AI responses stream word-by-word
   - Users see the AI "thinking" in real-time
   - Powered by Vercel AI SDK

2. **Message History**
   - All messages displayed in chronological order
   - User messages in one color, AI in another
   - Scrollable chat window
   - Clear visual distinction between speakers

3. **Welcome Screen**
   - Shows when no messages yet
   - Explains the game concept
   - Provides instructions to get started

4. **Input Form**
   - Large text input for typing messages
   - Send button (disabled when empty)
   - Enter key to submit
   - Loading state during AI response
   - Helper text with tips

**User Experience Flow**
1. Student visits page
2. Sees their Student ID in header
3. Reads welcome message
4. Types first question
5. AI streams response
6. Conversation continues naturally

## 🔒 Backend Features

### OpenAI Integration

**Model Used**
- GPT-4 Turbo Preview
- Chosen for:
  - High quality responses
  - Good at following instructions
  - Appropriate for educational content
  - Reliable and consistent

**Configuration**
```javascript
{
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,      // Some creativity, not too random
  max_tokens: 500,       // Keep responses concise
  stream: true           // Enable word-by-word streaming
}
```

**System Prompt**
The AI is instructed to:
- Act as a detective game master
- Present mystery scenarios
- Provide clues and evidence
- Guide student reasoning
- Be encouraging and educational
- Keep content classroom-appropriate
- Respond concisely

### PII Filter (Privacy Protection)

**What Gets Filtered**
1. **Email Addresses**
   - Pattern: anything@domain.com
   - Replaced with: `[REDACTED EMAIL]`
   
2. **Phone Numbers**
   - Formats detected:
     - (123) 456-7890
     - 123-456-7890
     - 123.456.7890
     - 1234567890
     - +1 123 456 7890
   - Replaced with: `[REDACTED PHONE]`

**How It Works**
1. Student sends message with PII
2. Backend receives message
3. PII filter scans for patterns
4. Sensitive data replaced before sending to OpenAI
5. Original message saved to database (for teacher review)
6. Filtered message sent to AI
7. AI never sees the PII

**Example**
```
Student types: "Call me at 555-1234"
Sent to OpenAI: "Call me at [REDACTED PHONE]"
Saved to DB: "Call me at 555-1234" (for teacher)
```

**Benefits**
- Protects student privacy
- Complies with data protection regulations
- Teachers can review original messages if needed
- OpenAI never receives sensitive information

### Chat Logging to Supabase

**What Gets Logged**
- Student ID
- Message content (original, unfiltered)
- Role (user or assistant)
- Timestamp

**Database Schema**
```sql
chat_logs {
  id: UUID (primary key)
  student_id: TEXT
  message: TEXT
  role: TEXT ('user' or 'assistant')
  created_at: TIMESTAMP
}
```

**Logging Process**
1. User sends message → Logged immediately
2. AI generates response → Logged after completion
3. All messages timestamped automatically
4. Indexed by student ID and time for fast queries

**Benefits for Teachers**
- Review student interactions
- Check for inappropriate content
- Track student engagement
- Assess understanding of concepts
- Export data for analysis

## 👨‍🏫 Admin Dashboard Features

### Password Protection

**Simple But Effective**
- Password: `detective2024` (changeable)
- Simple form interface
- Error handling for wrong passwords
- Session-based (lasts while browser open)

**Security Note**
This is suitable for classroom use but should be upgraded for production:
- Consider implementing NextAuth.js
- Use environment variables for password
- Add rate limiting for password attempts

### Student Overview

**Display Information**
- List of all unique student IDs
- Message count per student
- Last activity timestamp
- Sorted by most recent activity

**Features**
- Click student to view their chat logs
- Refresh button to get latest data
- Real-time updates from database
- Responsive grid layout

**Example Display**
```
ABC123
14 messages
Last: Dec 7, 2024, 3:45 PM
```

### Chat Log Viewer

**Functionality**
- Select a student from the list
- View their complete conversation history
- Messages displayed in chronological order
- User messages visually distinct from AI responses
- Timestamps for each message
- Scrollable container

**Visual Design**
- User messages: One color scheme
- AI messages: Different color scheme
- Clear timestamps
- Easy to read format

**Use Cases**
1. **Check Comprehension**: See how students are engaging
2. **Monitor Safety**: Ensure appropriate conversations
3. **Provide Feedback**: Review student thinking
4. **Assessment**: Use conversations as learning evidence
5. **Parent Communication**: Share student progress

### Real-time Data

**Updates**
- Click refresh to get latest data
- Shows new students immediately
- Updates message counts
- Reflects latest activity times

**No Automatic Polling**
- Manual refresh prevents unnecessary database queries
- Teacher controls when to check for updates
- Reduces server load

## 🎨 Customization Options

### Easy Customizations

1. **Change Colors** (`tailwind.config.ts`)
   ```javascript
   colors: {
     terminal: {
       text: '#your-color-here',
       // ... more colors
     }
   }
   ```

2. **Change AI Personality** (`app/api/chat/route.ts`)
   ```javascript
   const systemMessage = {
     content: `Your custom prompt here...`
   }
   ```

3. **Change Admin Password** (`app/admin/page.tsx`)
   ```javascript
   const ADMIN_PASSWORD = 'your-password';
   ```

4. **Adjust Response Length** (`app/api/chat/route.ts`)
   ```javascript
   max_tokens: 1000, // Longer responses
   ```

5. **Change Font** (`app/layout.tsx`)
   ```javascript
   // Import different Google Font
   ```

## 🔐 Privacy & Security Features

### Built-in Protections

1. **No Personal Registration**
   - Random IDs only
   - No names, emails, or personal info collected
   - COPPA/FERPA friendly

2. **PII Filtering**
   - Automatic removal of sensitive data
   - Prevents accidental data sharing

3. **Environment Variables**
   - API keys never in code
   - .gitignore prevents accidental commits

4. **Local Storage Only**
   - Student IDs stored in browser
   - No server-side student database
   - Privacy by design

## 📊 Performance Features

### Optimizations

1. **Edge Runtime**
   - Fast response times
   - Deployed close to users
   - Low latency

2. **Streaming Responses**
   - Users see content immediately
   - Appears faster than waiting for complete response
   - Better user experience

3. **Database Indexes**
   - Fast student lookup
   - Quick chronological queries
   - Efficient admin dashboard

4. **Static Generation**
   - Main pages pre-rendered
   - Fast initial load
   - Better SEO

## 🎓 Educational Features

### Learning Benefits

1. **Critical Thinking**
   - Students must analyze clues
   - Ask good questions
   - Draw logical conclusions

2. **Communication Skills**
   - Practice clear writing
   - Ask specific questions
   - Explain reasoning

3. **Engagement**
   - Interactive format
   - Immediate feedback
   - Game-like experience

4. **Safe Practice**
   - No judgment from peers
   - Can try different approaches
   - Learn from mistakes privately

### Teacher Benefits

1. **Monitoring**
   - See all student interactions
   - Identify struggling students
   - Assess understanding

2. **Flexibility**
   - Use for homework or classwork
   - Individual or collaborative
   - Any mystery topic

3. **Scalability**
   - Works with 1 or 100 students
   - Minimal teacher intervention needed
   - Automatic conversation management

## 🚀 Technical Features

### Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 Turbo
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready
- **Runtime**: Edge & Node.js

### Code Quality

- **Comments**: Extensive inline documentation
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Try-catch blocks throughout
- **Fallbacks**: Graceful degradation
- **Validation**: Input sanitization

### Beginner-Friendly Code

Every file includes:
- Purpose explanation
- How it works
- Why certain choices were made
- Examples
- Troubleshooting tips

Perfect for:
- Students learning web development
- Teachers with basic coding knowledge
- Anyone wanting to understand the codebase

---

**Ready to explore? Start with the main chat interface at http://localhost:3000** 🔍
