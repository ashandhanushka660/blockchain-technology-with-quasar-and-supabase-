# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Project**: Have your Supabase project ready with credentials

## Step 1: Prepare Environment Variables

Create a `.env.production` file (DO NOT commit this):

```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 2: Deploy via Vercel Dashboard

### Option A: Deploy from GitHub (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:

   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:

   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
   - Make sure to add them for Production, Preview, and Development

5. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? rupee-cbdc-prototype
# - Directory? ./
# - Override settings? No
```

## Step 3: Configure Environment Variables via CLI

```bash
# Add environment variables
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted

# Redeploy to apply changes
vercel --prod
```

## Step 4: Verify Deployment

1. Visit your deployment URL (e.g., `https://your-project.vercel.app`)
2. Test the following features:
   - ✅ User registration
   - ✅ User login
   - ✅ Biometric authentication page
   - ✅ Send money functionality
   - ✅ Receive money with QR code
   - ✅ Transaction history
   - ✅ Dark mode toggle
   - ✅ Real-time notifications

## Step 5: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Once connected to GitHub, Vercel will automatically:

- Deploy on every push to `main` branch (Production)
- Create preview deployments for pull requests
- Run build checks before deploying

## Troubleshooting

### Build Fails

**Issue**: Build fails with module errors
**Solution**: Ensure all dependencies are in `package.json`, not just `devDependencies`

### Environment Variables Not Working

**Issue**: Supabase connection fails
**Solution**:

1. Verify environment variables are set in Vercel dashboard
2. Ensure variable names start with `VITE_`
3. Redeploy after adding variables

### 404 on Refresh

**Issue**: Page refresh returns 404
**Solution**: The `vercel.json` file should handle this. Verify it exists and has the correct routing configuration.

### PWA Not Working

**Issue**: Service worker not registering
**Solution**:

1. Ensure HTTPS is enabled (Vercel provides this by default)
2. Check browser console for service worker errors
3. Verify `vite-plugin-pwa` is properly configured

## Performance Optimization

Vercel automatically provides:

- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Compression (Brotli/Gzip)
- ✅ Image optimization
- ✅ Edge caching

## Monitoring

Access deployment analytics:

1. Go to your project in Vercel
2. Click "Analytics" tab
3. Monitor:
   - Page views
   - Performance metrics
   - Error rates

## Rollback

If something goes wrong:

1. Go to "Deployments" in Vercel dashboard
2. Find a previous successful deployment
3. Click "..." menu → "Promote to Production"

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
