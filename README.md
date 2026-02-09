# Portfolio Website

A modern, full-stack portfolio website built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📝 Blog system with markdown support
- 💼 Project showcase with filtering
- 💬 Contact form with message management
- ⭐ Review/testimonial system
- ❤️ Like system for blogs and projects
- 🖼️ Image upload for blogs and projects
- 🔐 Admin dashboard with authentication
- 📱 100% mobile responsive
- ⚡ Optimized for performance

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hriody-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   
   a. Go to your Supabase project dashboard
   
   b. Navigate to SQL Editor
   
   c. Run `database/setup.sql` (creates all tables, functions, and policies)
   
   d. (Optional) Run `database/seed.sql` (adds demo content)

5. **Create admin account**
   
   a. Start the development server: `npm run dev`
   
   b. Go to `http://localhost:3000/auth/login`
   
   c. Create an account with your email
   
   d. Go back to Supabase SQL Editor and run the admin user section in `database/setup.sql` (step 9)

6. **Start developing**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (main)/            # Public pages (home, blogs, projects, etc.)
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── dashboard/         # Admin dashboard
│   ├── components/            # React components
│   │   └── ui/               # shadcn/ui components
│   └── lib/                   # Utilities and configurations
├── database/                  # SQL setup and seed files
├── public/                    # Static assets
└── .env.local                # Environment variables (create this)
```

## Admin Dashboard

Access the admin dashboard at `/dashboard` after logging in with your admin account.

Features:
- Manage blogs (create, edit, delete)
- Manage projects (create, edit, delete)
- View and manage contact messages
- Manage reviews/testimonials
- Update site settings (hero, about sections)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Deploy!

### Post-Deployment

1. Update Supabase authentication settings:
   - Go to Authentication > URL Configuration
   - Add your production URL to Site URL and Redirect URLs

2. Update storage CORS settings if needed

## Customization

### Update Personal Information

1. **Hero Section**: Edit in Dashboard > Settings
2. **About Section**: Edit in Dashboard > Settings
3. **Profile Image**: Replace `/public/profile-pic.avif`
4. **Favicon**: Replace `/public/icon.png`

### Styling

- Colors and theme: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Component styles: Tailwind classes in components

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin operations) | Yes |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Database Schema

The database includes the following tables:
- `blogs` - Blog posts
- `projects` - Portfolio projects
- `messages` - Contact form submissions
- `reviews` - Client testimonials
- `site_settings` - Dynamic site content
- `user_likes` - Like tracking
- `admin_users` - Admin access control

See `database/setup.sql` for complete schema.

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access for CRUD operations
- Public read access for content
- Service role key used for admin operations
- Authentication required for dashboard access

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - feel free to use this project for your own portfolio!

---

Built with ❤️ by Hridoy
