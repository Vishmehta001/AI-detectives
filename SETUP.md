# 🚀 Setup Guide for AI Detective Game

This guide will walk you through setting up the AI Detective game for classroom use.

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Node.js 18 or higher** installed
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **An OpenAI API account**
   - Sign up at: https://platform.openai.com/
   - You'll need to add billing information
   - Cost: ~$0.01-0.03 per student conversation

3. **A Supabase account (free)**
   - Sign up at: https://supabase.com/
   - Free tier includes 500MB database storage

## 🔧 Step-by-Step Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-detectives

# Install dependencies
npm install
```

### Step 2: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Wait for the project to finish setting up (2-3 minutes)
3. Go to the **SQL Editor** in your project dashboard
4. Run this SQL query to create the chat logs table:

```sql
-- Create the chat_logs table
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chat_logs_student_id ON chat_logs(student_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at DESC);
```

5. Go to **Settings → API** and copy:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public key (a long string starting with `eyJ...`)

### Step 3: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "AI Detective Game")
4. Copy the key immediately (you won't be able to see it again!)
5. The key starts with `sk-...`

### Step 4: Configure Environment Variables

1. In the project folder, copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in a text editor and add your credentials:

```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

3. Save the file

### Step 5: Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at:
- **Student Chat**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 🎓 Using in the Classroom

### For Students

1. Students navigate to http://localhost:3000 (or your deployed URL)
2. They will automatically get a random Student ID (e.g., ABC123)
3. This ID is saved in their browser and persists across sessions
4. They can start chatting with the AI Detective immediately

### For Teachers

1. Navigate to http://localhost:3000/admin
2. Enter the password: **detective2024**
3. View:
   - List of all student IDs
   - Number of messages per student
   - Last activity time
   - Complete chat history for each student

## 🔒 Security Considerations

### Important Notes

1. **Change the Admin Password**
   - Open `app/admin/page.tsx`
   - Find the line: `const ADMIN_PASSWORD = 'detective2024';`
   - Change it to your own secure password

2. **PII Protection**
   - The app automatically filters emails and phone numbers
   - Filtered content is replaced with `[REDACTED EMAIL]` or `[REDACTED PHONE]`
   - Original messages are saved in the database for teacher review

3. **API Key Security**
   - Never commit `.env.local` to Git (it's in `.gitignore`)
   - Never share your OpenAI API key
   - Set spending limits in your OpenAI dashboard

## 🌐 Deploying to Production

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "Import Project" and select your repository
4. Add your environment variables in Vercel's settings:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Other Platforms

The app can be deployed to any platform that supports Next.js 14:
- Netlify
- Railway
- Render
- AWS Amplify

## 💰 Cost Estimation

### OpenAI API Costs (GPT-4 Turbo)

- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens
- Average conversation (10 messages): ~$0.01-0.03
- Class of 30 students: ~$0.30-0.90 per session

**Tip**: Start with a spending limit of $5-10 in your OpenAI dashboard.

### Supabase

- Free tier: 500MB database, 2GB bandwidth
- More than enough for a classroom with hundreds of chat logs

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Failed to fetch" in admin dashboard

- Check that your Supabase credentials are correct in `.env.local`
- Make sure the `chat_logs` table exists in Supabase
- Restart the dev server after changing `.env.local`

### Chat not working

- Check that your OpenAI API key is correct
- Make sure you have billing enabled in OpenAI
- Check the browser console for errors (F12 → Console)

### Student ID not persisting

- Check that localStorage is enabled in the browser
- Private/Incognito mode may block localStorage
- Try a different browser

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## 💡 Customization Ideas

1. **Change AI Personality**: Edit the system message in `app/api/chat/route.ts`
2. **Add More Mystery Scenarios**: Update the AI prompt with specific cases
3. **Custom Themes**: Modify colors in `tailwind.config.ts`
4. **Add Authentication**: Implement NextAuth.js for secure student login
5. **Analytics**: Add charts to the admin dashboard

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review the error messages carefully
3. Check the browser console (F12)
4. Open a GitHub issue with details about your problem

## ✅ Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned and dependencies installed
- [ ] Supabase project created
- [ ] `chat_logs` table created in Supabase
- [ ] OpenAI API key obtained
- [ ] `.env.local` file created with all credentials
- [ ] Dev server running successfully
- [ ] Tested chat interface
- [ ] Tested admin dashboard
- [ ] Changed admin password
- [ ] Ready for classroom use!

---

**Happy detecting! 🔍**
