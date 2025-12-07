# 🔧 Troubleshooting Guide

Common issues and their solutions for the AI Detective Game.

## Installation Issues

### "Cannot find module" errors

**Problem**: After running `npm install`, you get module not found errors.

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

### "npm ERR! ERESOLVE unable to resolve dependency tree"

**Problem**: Dependency conflicts during installation.

**Solution**:
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps
```

## Build Issues

### "Module not found: Can't resolve 'ai/react'"

**Problem**: Wrong version of AI SDK installed.

**Solution**:
```bash
# Make sure you have the correct version
npm install ai@3.3 openai-edge
```

### "Failed to fetch font from Google Fonts"

**Problem**: Can't access Google Fonts (network restriction).

**Solution**: The app already uses a fallback monospace font. This warning can be ignored, or update `app/layout.tsx` to remove the Google Font import.

### "Invalid Options: useEslintrc, extensions"

**Problem**: ESLint configuration warning.

**Solution**: This is a warning, not an error. The build will succeed. To fix:
```bash
npm install -D eslint@9 eslint-config-next@latest
```

## Runtime Issues

### Chat not responding

**Problem**: Messages sent but no AI response.

**Possible Causes & Solutions**:

1. **Invalid OpenAI API Key**
   ```bash
   # Check your .env.local file
   # Make sure OPENAI_API_KEY starts with 'sk-'
   # Verify key at https://platform.openai.com/api-keys
   ```

2. **No OpenAI Credits**
   - Check your OpenAI billing dashboard
   - Add payment method if needed
   - Set up usage limits

3. **Network/Firewall Issues**
   ```bash
   # Test OpenAI API connection
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_KEY_HERE"
   ```

4. **Edge Runtime Issues**
   - Check browser console (F12 → Console)
   - Look for error messages
   - Try a different browser

### Student ID not saving

**Problem**: Student ID changes every refresh.

**Possible Causes & Solutions**:

1. **Private/Incognito Mode**
   - localStorage is disabled in private browsing
   - Use normal browser mode

2. **Browser Settings**
   - Check that cookies/localStorage is enabled
   - Settings → Privacy → Site Data

3. **HTTPS Required**
   - If deployed, make sure you're using HTTPS
   - HTTP may block localStorage in some browsers

### "Failed to fetch" in Admin Dashboard

**Problem**: Admin dashboard shows "No student activity" but there should be data.

**Possible Causes & Solutions**:

1. **Supabase Not Configured**
   ```bash
   # Check .env.local has:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

2. **Table Doesn't Exist**
   - Go to Supabase SQL Editor
   - Run the table creation script from SETUP.md
   - Verify table exists in Table Editor

3. **Wrong Credentials**
   - Double-check URL and key from Supabase
   - Settings → API in your Supabase project
   - Copy the exact values (no extra spaces)

4. **CORS Issues**
   - Supabase should allow all origins by default
   - Check Authentication → URL Configuration
   - Add your domain to allowed origins if deployed

### Admin password not working

**Problem**: Correct password rejected.

**Solution**:
1. Check `app/admin/page.tsx` for current password
2. Look for: `const ADMIN_PASSWORD = 'detective2024';`
3. Make sure there are no typos
4. Clear browser cache and try again

## Development Issues

### "Port 3000 is already in use"

**Problem**: Can't start dev server.

**Solution**:
```bash
# Option 1: Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
npm run dev -- -p 3001
```

### Changes not reflecting

**Problem**: Code changes don't appear in browser.

**Solution**:
1. **Hard refresh**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear cache**: Browser settings → Clear browsing data
3. **Restart dev server**: Stop (Ctrl+C) and `npm run dev` again
4. **Check for errors**: Look at terminal output
5. **Delete .next folder**: `rm -rf .next && npm run dev`

### TypeScript errors

**Problem**: Type errors during development.

**Solution**:
```bash
# Regenerate TypeScript types
npx next telemetry disable
rm -rf .next
npm run build
```

## Deployment Issues

### Vercel deployment fails

**Problem**: Build succeeds locally but fails on Vercel.

**Possible Causes & Solutions**:

1. **Missing Environment Variables**
   - Go to Vercel project settings
   - Environment Variables section
   - Add all variables from .env.local
   - Redeploy

2. **Wrong Node Version**
   - Vercel Settings → General → Node.js Version
   - Select Node.js 18.x or higher

3. **Build Command Wrong**
   - Should be: `npm run build`
   - Check in Vercel project settings

### API routes timing out

**Problem**: Chat API takes too long and times out.

**Solution**:
1. **Check OpenAI Status**: https://status.openai.com/
2. **Reduce max_tokens**: Edit `app/api/chat/route.ts`, lower from 500
3. **Use faster model**: Change to `gpt-3.5-turbo` for testing
4. **Check Edge Runtime**: Make sure `export const runtime = 'edge';` is present

## Database Issues

### Supabase queries slow

**Problem**: Admin dashboard loads slowly.

**Solution**:
1. **Check indexes exist**:
   ```sql
   -- Run in Supabase SQL Editor
   \d chat_logs
   -- Should show indexes on student_id and created_at
   ```

2. **Add missing indexes**:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_chat_logs_student_id 
     ON chat_logs(student_id);
   CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at 
     ON chat_logs(created_at DESC);
   ```

### "Row Level Security" errors

**Problem**: Can't read/write to Supabase.

**Solution**:
```sql
-- Temporarily disable RLS for testing
-- (Enable it properly for production)
ALTER TABLE chat_logs DISABLE ROW LEVEL SECURITY;
```

For production, set up proper RLS policies:
```sql
-- Allow all operations with anon key
CREATE POLICY "Allow all operations"
  ON chat_logs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
```

## Browser-Specific Issues

### Safari issues

**Problem**: Chat doesn't work in Safari.

**Solution**:
1. Enable JavaScript
2. Disable "Prevent cross-site tracking"
3. Try in Chrome/Firefox instead

### Mobile issues

**Problem**: Interface doesn't work on mobile.

**Solutions**:
- Use landscape orientation for better experience
- Font size may be small - zoom in
- Keyboard may cover input - scroll up after typing

## Performance Issues

### Slow responses

**Problem**: AI takes a long time to respond.

**Possible Causes**:
1. **OpenAI API Slow**: Check https://status.openai.com/
2. **Network Slow**: Test internet speed
3. **Large Context**: Long conversations take longer
4. **Model Busy**: Try different time of day

**Solutions**:
- Use `gpt-3.5-turbo` for faster responses
- Reduce `max_tokens` in API route
- Clear conversation and start fresh

### High API costs

**Problem**: OpenAI bill higher than expected.

**Solutions**:
1. **Set spending limits**: OpenAI dashboard → Usage limits
2. **Use GPT-3.5**: Cheaper than GPT-4
3. **Reduce max_tokens**: Lower from 500 to 300
4. **Monitor usage**: OpenAI dashboard → Usage

## Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console (F12)
4. ✅ Verify all environment variables
5. ✅ Try in a different browser
6. ✅ Check that services are online (OpenAI, Supabase)

### When asking for help, include:

- Error message (complete text)
- What you were trying to do
- What happened instead
- Browser and version
- Node.js version (`node --version`)
- Relevant code snippets
- Steps to reproduce

### Where to get help:

1. **GitHub Issues**: Open an issue in the repository
2. **Documentation**: Re-read README, SETUP, and FEATURES
3. **External Resources**:
   - Next.js Discord
   - OpenAI Community Forum
   - Supabase Discord

## Quick Diagnostic Commands

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Verify .env.local exists and has content
cat .env.local

# Test build
npm run build

# Check for port conflicts
lsof -i :3000

# View recent logs
npm run dev 2>&1 | tee dev.log
```

## Still Stuck?

If none of these solutions work:

1. **Start fresh**:
   ```bash
   # Back up your .env.local
   cp .env.local .env.local.backup
   
   # Delete everything and re-clone
   cd ..
   rm -rf AI-detectives
   git clone <repo-url>
   cd AI-detectives
   
   # Restore environment variables
   cp .env.local.backup .env.local
   
   # Fresh install
   npm install
   npm run dev
   ```

2. **Open a GitHub issue** with:
   - Full error message
   - Steps you've tried
   - Your environment (OS, Node version, browser)
   - Screenshots if applicable

---

**Most issues can be solved by carefully checking environment variables and following the setup guide!** 🔍
