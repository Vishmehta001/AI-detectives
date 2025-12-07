# 🔍 AI Detective Game

A classroom-friendly AI Detective game built with Next.js 14, featuring a terminal-style interface where students can interact with an AI detective to solve mysteries.

## 🎯 Features

### Frontend (Student Experience)
- **Detective Terminal Theme**: Dark background with green text for an authentic hacker/detective aesthetic
- **No Login Required**: Each student gets a randomly generated ID stored in localStorage
- **Real-time Chat**: Streaming responses from the AI using Vercel AI SDK
- **Privacy Protection**: Automatic PII filtering (emails and phone numbers) before sending to AI

### Backend
- **OpenAI Integration**: Powered by GPT-4 Turbo for intelligent, contextual responses
- **PII Filter**: Automatically redacts emails and phone numbers from student messages
- **Chat Logging**: All conversations are stored in Supabase for teacher review

### Admin Dashboard
- **Password Protected**: Simple password protection for classroom use
- **Student Overview**: View all student IDs and their activity
- **Chat History**: Review complete conversation logs for each student
- **Real-time Updates**: Refresh to see the latest student activity

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- An OpenAI API key
- A Supabase account (free tier works great)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AI-detectives
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase Database

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor and run this query:

```sql
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_logs_student_id ON chat_logs(student_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at DESC);
```

4. Get your project URL and anon key from Settings > API

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your credentials:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Access the Admin Dashboard

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

**Default password**: `detective2024`

(Change this in `app/admin/page.tsx` for production use)

## 📁 Project Structure

```
AI-detectives/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI chat API endpoint
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   ├── page.tsx                  # Main chat interface
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   └── supabase.ts               # Supabase client configuration
├── utils/
│   ├── studentId.ts              # Student ID generation
│   └── piiFilter.ts              # PII filtering logic
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## 🎨 Customization

### Changing the Theme Colors

Edit `tailwind.config.ts` to customize the terminal colors:

```typescript
colors: {
  terminal: {
    bg: '#0a0e0a',           // Background
    surface: '#0f1410',      // Card backgrounds
    border: '#1a2618',       // Borders
    text: '#00ff41',         // Primary text
    'text-secondary': '#00cc33',  // AI responses
    'text-dim': '#009929',   // Dim text
    accent: '#39ff14',       // Highlights
  },
},
```

### Changing the AI Personality

Edit the system message in `app/api/chat/route.ts`:

```typescript
const systemMessage = {
  role: 'system',
  content: `Your custom AI detective personality here...`
};
```

### Changing the Admin Password

Edit `app/admin/page.tsx`:

```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

## 🔒 Security Notes

### For Classroom Use
- The admin password is stored in the code (simple but works for classroom)
- PII filtering protects student privacy
- All chats are logged for teacher review

### For Production Use
Consider these improvements:
- Implement proper authentication (e.g., NextAuth.js)
- Use environment variables for the admin password
- Add rate limiting to prevent API abuse
- Set up Row Level Security (RLS) in Supabase
- Add HTTPS in production

## 📚 Code Comments

This project includes extensive comments throughout the codebase to help beginners understand:
- How Next.js 14 app router works
- How to use the Vercel AI SDK
- How to integrate with OpenAI
- How to use Supabase for data storage
- How localStorage works for client-side state
- How to create a chat interface with streaming responses

## 🛠️ Technologies Used

- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vercel AI SDK**: Streaming AI responses
- **OpenAI API**: GPT-4 Turbo for chat
- **Supabase**: PostgreSQL database for chat logs
- **React**: UI library

## 📝 License

MIT License - feel free to use this for your classroom!

## 🤝 Contributing

This is a classroom project, but suggestions and improvements are welcome!

## 📧 Support

For questions or issues, please open a GitHub issue.