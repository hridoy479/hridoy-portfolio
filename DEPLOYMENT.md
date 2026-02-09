# Deployment Guide

This guide will help you deploy your portfolio website to production.

## Pre-Deployment Checklist

- [ ] All environment variables are set up
- [ ] Database is set up in Supabase
- [ ] Admin account is created
- [ ] Test the application locally
- [ ] Update personal information (hero, about sections)
- [ ] Replace placeholder images
- [ ] Add your own projects and blog posts
- [ ] Test contact form
- [ ] Test authentication

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Step 5: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

4. Update storage CORS (if needed):
   - Go to Storage > Policies
   - Ensure your domain is allowed

## Deploy to Other Platforms

### Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### Railway

1. Create new project from GitHub
2. Add environment variables
3. Railway will auto-detect Next.js and deploy

### Self-Hosted (VPS)

1. Install Node.js 18+ on your server
2. Clone your repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

## Post-Deployment

### 1. Test Everything

- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] Images load properly
- [ ] Contact form works
- [ ] Admin login works
- [ ] Dashboard is accessible
- [ ] CRUD operations work
- [ ] Like system works

### 2. Set Up Custom Domain (Optional)

#### Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

#### Update Supabase:
1. Add custom domain to Supabase redirect URLs
2. Update Site URL if needed

### 3. Performance Optimization

- Enable Vercel Analytics (optional)
- Set up monitoring (Sentry, LogRocket, etc.)
- Configure CDN for images
- Enable compression

### 4. SEO Setup

1. Update `src/app/layout.tsx` metadata:
   ```typescript
   export const metadata = {
     title: 'Your Name - Portfolio',
     description: 'Your description',
     // Add more metadata
   }
   ```

2. Add `robots.txt` in `public/` folder
3. Add `sitemap.xml` (can use next-sitemap package)
4. Submit to Google Search Console

### 5. Security

- [ ] Environment variables are secure
- [ ] Service role key is not exposed
- [ ] RLS policies are properly configured
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled (if needed)

## Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run lint`
- Review build logs for specific errors

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart development server after adding variables
- In Vercel, redeploy after adding variables

### Database Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies allow necessary operations
- Check network/firewall settings

### Authentication Issues

- Verify redirect URLs in Supabase
- Check Site URL matches your domain
- Clear browser cache and cookies
- Test in incognito mode

### Images Not Loading

- Check Supabase storage buckets are public
- Verify storage policies allow public access
- Ensure image URLs are correct
- Check CORS settings

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard for:
- Page views
- Performance metrics
- User analytics

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## Backup

### Database Backup

1. Go to Supabase Dashboard
2. Database > Backups
3. Enable automatic backups
4. Download manual backup if needed

### Code Backup

- Keep code in GitHub
- Tag releases: `git tag v1.0.0`
- Create branches for major changes

## Updates

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Deploying Updates

```bash
git add .
git commit -m "Update description"
git push
```

Vercel will automatically deploy on push to main branch.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console for errors
4. Check this guide's troubleshooting section

---

Good luck with your deployment! 🚀
