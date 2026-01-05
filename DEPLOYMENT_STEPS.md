# 🚀 Step-by-Step Deployment Guide

## ✅ Current Status

- ✅ Git repository initialized
- ✅ Initial commit created (31 files, 11,967 lines)
- ✅ Production build tested and passing
- ⏳ Ready to push to GitHub
- ⏳ Ready to deploy to Vercel

---

## 📋 Step 1: Push to GitHub

### Option A: Create New Repository on GitHub (Recommended)

1. **Go to GitHub** and create a new repository:

   - Visit: https://github.com/new
   - Repository name: `rupee-cbdc-prototype` (or your preferred name)
   - Description: "Sri Lankan Rupee CBDC Digital Wallet - Progressive Web App"
   - Visibility: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Copy the repository URL** (it will look like):

   ```
   https://github.com/YOUR_USERNAME/rupee-cbdc-prototype.git
   ```

3. **Run these commands in your terminal**:

   ```bash
   # Add the remote repository
   git remote add origin https://github.com/YOUR_USERNAME/rupee-cbdc-prototype.git

   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Option B: Use Existing Repository

If you already have a repository:

```bash
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

---

## 📋 Step 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**:

   - Visit: https://vercel.com/new
   - Sign in with GitHub (recommended)

2. **Import Your Repository**:

   - Click "Import Git Repository"
   - Select your `rupee-cbdc-prototype` repository
   - Click "Import"

3. **Configure Project**:

   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   | Name                     | Value                     |
   | ------------------------ | ------------------------- |
   | `VITE_SUPABASE_URL`      | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key    |

   **Important**: Add these for all environments (Production, Preview, Development)

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://rupee-cbdc-prototype.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

   Follow the prompts:

   - Set up and deploy? **Yes**
   - Which scope? **Select your account**
   - Link to existing project? **No**
   - What's your project's name? **rupee-cbdc-prototype**
   - In which directory is your code located? **./`**
   - Want to override the settings? **No**

4. **Add Environment Variables**:

   ```bash
   vercel env add VITE_SUPABASE_URL production
   # Paste your Supabase URL when prompted

   vercel env add VITE_SUPABASE_ANON_KEY production
   # Paste your Supabase anon key when prompted
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 📋 Step 3: Verify Deployment

### Test Your Deployed App

1. **Visit your Vercel URL**
2. **Test these features**:
   - [ ] Homepage loads correctly
   - [ ] User registration works
   - [ ] User login works
   - [ ] Dashboard displays
   - [ ] Send money functionality
   - [ ] Receive money with QR code
   - [ ] Transaction history
   - [ ] Dark mode toggle
   - [ ] Biometric page loads
   - [ ] Notifications work
   - [ ] Mobile responsive
   - [ ] PWA installable

### Check Deployment Logs

If something doesn't work:

1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on the latest deployment
5. Check "Build Logs" and "Function Logs"

---

## 📋 Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:

   - Go to your project
   - Click "Settings"
   - Click "Domains"
   - Click "Add Domain"

2. **Add Your Domain**:
   - Enter your domain (e.g., `cbdc.yourdomain.com`)
   - Follow DNS configuration instructions
   - Wait for DNS propagation (can take up to 48 hours)

---

## 🔧 Troubleshooting

### Build Fails on Vercel

**Error**: "Module not found"

```bash
# Solution: Ensure all dependencies are in package.json
# Check that devDependencies that are needed for build are listed
```

**Error**: "Environment variables not found"

```bash
# Solution: Add environment variables in Vercel dashboard
# Make sure they start with VITE_
# Redeploy after adding variables
```

### App Loads but Features Don't Work

**Issue**: Supabase connection fails

```bash
# Solution:
# 1. Verify environment variables in Vercel
# 2. Check Supabase project is active
# 3. Verify RLS policies are enabled
# 4. Check browser console for errors
```

**Issue**: 404 on page refresh

```bash
# Solution: Verify vercel.json exists with correct routing
# The file should already be in your project
```

### Notifications Don't Work

**Issue**: Real-time notifications not appearing

```bash
# Solution:
# 1. Enable Realtime in Supabase dashboard
# 2. Add transactions table to Realtime publication
# 3. Check browser notification permissions
```

---

## 📊 Post-Deployment Checklist

- [ ] App deployed successfully
- [ ] Environment variables configured
- [ ] All features tested
- [ ] Supabase connection working
- [ ] RLS policies active
- [ ] Realtime notifications enabled
- [ ] PWA installable
- [ ] Mobile responsive verified
- [ ] Dark mode working
- [ ] Custom domain configured (optional)

---

## 🎯 Next Steps After Deployment

1. **Monitor Performance**:

   - Check Vercel Analytics
   - Monitor error rates
   - Track user engagement

2. **Set Up Continuous Deployment**:

   - Every push to `main` branch auto-deploys
   - Pull requests create preview deployments
   - Automatic build checks

3. **Share Your App**:

   - Share the Vercel URL
   - Add to your portfolio
   - Demo to stakeholders

4. **Future Enhancements**:
   - Add more transaction types
   - Implement spending analytics
   - Add multi-currency support
   - Integrate real biometric APIs

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Docs**: https://docs.github.com

---

## 🎉 Congratulations!

Your Rupee CBDC Prototype is now live and accessible to the world! 🚀

**Your deployment URL**: `https://your-project.vercel.app`

---

**Built with ❤️ for Sri Lankan Digital Currency Innovation**
