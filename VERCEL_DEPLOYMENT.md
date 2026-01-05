# 🚀 Vercel Deployment Guide - Wallet Hub

## Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ GitHub repository with latest code
- ✅ Supabase project set up
- ✅ Vercel account (free tier works!)

## Step 1: Prepare Environment Variables

You'll need these environment variables from your Supabase project:

1. **VITE_SUPABASE_URL** - Your Supabase project URL
2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous key

### Finding Your Supabase Credentials:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## Step 2: Run Database Migration

**IMPORTANT:** Before deploying, run the contacts migration:

1. Open Supabase Dashboard → **SQL Editor**
2. Copy contents from `migrations/create_wallet_contacts.sql`
3. Paste and click **Run**
4. Verify `wallet_contacts` table exists in **Table Editor**

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**

   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**

   - Click **"Add New..."** → **"Project"**
   - Select your repository:
     ```
     ashandhanushka660/blockchain-technology-with-quasar-and-supabase-
     ```

3. **Configure Project**

   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Add Environment Variables**

   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 4: Verify Deployment

After deployment, test these features:

### ✅ Basic Functionality

- [ ] Login/Register works
- [ ] Dashboard loads
- [ ] Wallet balance displays
- [ ] Transaction history shows

### ✅ Contacts Feature

- [ ] Navigate to Contacts page
- [ ] Add a new contact
- [ ] Search contacts
- [ ] Edit contact
- [ ] Delete contact
- [ ] Send money to contact
- [ ] Copy wallet address

### ✅ Mobile Responsiveness

- [ ] Test on mobile browser
- [ ] Bottom navigation works
- [ ] All features accessible

## Step 5: Post-Deployment Setup

### Configure Supabase for Production

1. **Update Redirect URLs**

   - Go to Supabase Dashboard → **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**:
     ```
     https://your-project.vercel.app
     https://your-project.vercel.app/**
     ```

2. **Update Site URL**

   - Set **Site URL** to: `https://your-project.vercel.app`

3. **Test Authentication**
   - Try logging in on production
   - Verify email confirmations work

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically builds and deploys!
```

## Environment Variables Reference

| Variable                 | Description            | Example                      |
| ------------------------ | ---------------------- | ---------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL   | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...`                 |

## Build Configuration

The project uses these build settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure environment variables are set

### Blank Page After Deploy

- Check browser console for errors
- Verify environment variables are correct
- Check Supabase URL configuration

### Authentication Not Working

- Verify redirect URLs in Supabase
- Check Site URL matches your Vercel domain
- Ensure CORS is configured in Supabase

### Contacts Feature Not Working

- Verify database migration was run
- Check RLS policies are enabled
- Verify table exists in Supabase

## Performance Optimization

Your app is already optimized with:

- ✅ Code splitting
- ✅ Lazy loading routes
- ✅ Optimized images
- ✅ Minified CSS/JS
- ✅ Gzip compression (Vercel default)

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `cbdc.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## Monitoring

Vercel provides:

- **Analytics** - Page views, performance
- **Logs** - Real-time function logs
- **Insights** - Core Web Vitals

Access at: `https://vercel.com/dashboard/analytics`

## Rollback

If something goes wrong:

1. Go to Vercel Dashboard → **Deployments**
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**

## Security Checklist

Before going live:

- [ ] Environment variables are set
- [ ] RLS policies enabled in Supabase
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] API keys are not in code
- [ ] `.env` is in `.gitignore`

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create an issue in your repo

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Database migration run in Supabase
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Supabase redirect URLs updated
- [ ] Features tested on production
- [ ] Mobile responsiveness verified

---

**Your Wallet Hub is ready for production!** 🎉

Live URL: `https://your-project.vercel.app`

**Next Steps:**

1. Share the link with users
2. Monitor analytics
3. Gather feedback
4. Iterate and improve

Happy deploying! 🚀✨
