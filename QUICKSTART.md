# Quick Start Guide

Get your portfolio up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Set Up Supabase (3 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project to be ready (~2 minutes)
3. Go to Project Settings > API
4. Copy your project URL and keys

### 3. Configure Environment (1 min)

Create `.env.local` file in root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Set Up Database (2 min)

1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `database/setup.sql`
3. Paste and click "Run"
4. (Optional) Run `database/seed.sql` for demo data

### 5. Create Admin Account (2 min)

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/login`
3. Click "Sign Up" and create account with your email
4. Go back to Supabase SQL Editor
5. Run this (replace with your email):

```sql
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'your-email@example.com';
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, email)
    VALUES (admin_user_id, 'your-email@example.com')
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;
```

### 6. Start Building! (1 min)

1. Visit `http://localhost:3000` - see your portfolio
2. Visit `http://localhost:3000/dashboard` - manage content
3. Start customizing!

## What's Next?

### Customize Your Portfolio

1. **Update Personal Info**
   - Go to Dashboard > Settings
   - Update hero and about sections

2. **Add Your Projects**
   - Go to Dashboard > Projects
   - Click "Add New Project"
   - Fill in details and upload images

3. **Write Blog Posts**
   - Go to Dashboard > Blogs
   - Click "Add New Blog"
   - Write in markdown format

4. **Replace Images**
   - Replace `/public/profile-pic.avif` with your photo
   - Replace `/public/icon.png` with your favicon

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## Common Issues

### "Cannot connect to database"
- Check your Supabase URL and keys in `.env.local`
- Ensure Supabase project is active

### "Not authorized" in dashboard
- Make sure you ran the admin user SQL script
- Check you're logged in with the correct email

### Images not uploading
- Verify storage buckets were created (check `database/setup.sql`)
- Check storage policies in Supabase dashboard

### Contact form not working
- Ensure `database/setup.sql` was run completely
- Check browser console for errors

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Check Supabase logs in dashboard
- Review browser console for errors

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (main)/          # Public pages
│   │   ├── dashboard/       # Admin dashboard
│   │   └── api/            # API routes
│   ├── components/          # React components
│   └── lib/                # Utilities
├── database/               # SQL files
│   ├── setup.sql          # Main setup
│   └── seed.sql           # Demo data
└── public/                # Static files
```

## Key Features

✅ Blog system with markdown
✅ Project showcase
✅ Contact form
✅ Admin dashboard
✅ Like system
✅ Image uploads
✅ Reviews/testimonials
✅ Mobile responsive
✅ Dark mode support

---

Happy building! 🚀
