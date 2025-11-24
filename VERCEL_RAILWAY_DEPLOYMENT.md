# Quick Deployment Checklist

## Before You Start:
- [ ] GitHub account created
- [ ] Railway account (sign up at https://railway.app)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Code pushed to GitHub repository

## Your Deployment Plan:
1. Railway: Backend (FastAPI) + MongoDB
2. Vercel: Frontend (React)
3. Connect them together

---

## Step-by-Step Commands

### 1. Push to GitHub (if not already done)
```bash
# In your terminal, navigate to /app directory
cd /app

# Initialize git if needed
git init
git add .
git commit -m "Ready for deployment"

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## PART 1: Deploy Backend + Database on Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your photography portfolio repository
4. Railway will start analyzing your project

### Step 3: Add MongoDB Database
1. In your Railway project dashboard, click "+ New"
2. Select "Database"
3. Choose "Add MongoDB"
4. Railway will provision a MongoDB instance (takes ~30 seconds)
5. Click on the MongoDB service
6. Go to "Variables" tab
7. **COPY** the `MONGO_URL` value (you'll need this!)
   - It looks like: `mongodb://mongo:password@containers.railway.app:12345/railway`

### Step 4: Configure Backend Service
1. Click on your main service (should be auto-detected as backend)
2. Go to "Settings" tab
3. **Root Directory**: Set to `backend`
4. **Start Command**: Set to `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Go to "Variables" tab
6. Add these environment variables:
   ```
   MONGO_URL=<paste the MongoDB URL from Step 3>
   PORT=8001
   ```
7. Click "Deploy" or wait for auto-deploy

### Step 5: Get Backend URL
1. Go to "Settings" tab
2. Click "Generate Domain"
3. **COPY** your backend URL (you'll need this for Vercel!)
   - It looks like: `https://your-app-production.up.railway.app`
4. Save this URL somewhere safe!

✅ **Railway Backend Deployed!**

---

## PART 2: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find your photography portfolio repository
3. Click "Import"

### Step 3: Configure Build Settings
Vercel will auto-detect settings, but verify:

1. **Framework Preset**: Create React App (or Vite if detected)
2. **Root Directory**: Change to `frontend` (IMPORTANT!)
3. **Build Command**: `yarn build`
4. **Output Directory**: `build`
5. **Install Command**: `yarn install`

### Step 4: Add Environment Variable
⚠️ **CRITICAL STEP**

In the "Environment Variables" section:
1. Click "Add"
2. **Name**: `REACT_APP_BACKEND_URL`
3. **Value**: Paste your Railway backend URL from Part 1, Step 5
   - Example: `https://your-app-production.up.railway.app`
4. Select all environments: Production, Preview, Development
5. Click "Add"

### Step 5: Deploy
1. Click "Deploy"
2. Vercel will build and deploy (takes 2-5 minutes)
3. ☕ Wait for "Congratulations!" message
4. **COPY** your Vercel URL
   - It looks like: `https://your-portfolio.vercel.app`

✅ **Vercel Frontend Deployed!**

---

## PART 3: Final Configuration

### Step 1: Update CORS in Backend
You need to allow your Vercel domain in the backend:

1. In Railway, go to your backend service
2. You'll need to update the CORS settings
3. The backend should already allow all origins, but if you get CORS errors:
   - Go to Settings → Variables
   - Add: `FRONTEND_URL=https://your-portfolio.vercel.app`

### Step 2: Test Your Deployment

**Frontend Test:**
1. Visit your Vercel URL: `https://your-portfolio.vercel.app`
2. You should see your homepage
3. Check if projects load

**Admin Test:**
1. Go to: `https://your-portfolio.vercel.app/admin/login`
2. Login with: `admin` / `admin123`
3. Try uploading a test image

**If you see errors:**
- Check browser console (F12)
- Verify `REACT_APP_BACKEND_URL` in Vercel settings
- Check Railway backend logs

### Step 3: Upload Your Content
1. Login to admin dashboard
2. Go to Settings → About Page Content
3. Update company name, about paragraph, contacts
4. Go to Dashboard → Create projects
5. Upload your photos!

---

## 🎉 SUCCESS CHECKLIST

- [ ] Railway backend is running (green status)
- [ ] MongoDB is connected
- [ ] Vercel frontend is deployed
- [ ] Frontend loads without errors
- [ ] Can login to admin panel
- [ ] Can upload images
- [ ] Images display correctly
- [ ] About page shows your content

---

## 💰 Costs

**Free Tier Limits:**
- **Railway**: $5 credit/month (resets monthly)
  - Usually sufficient for personal portfolios
  - ~550 hours of uptime per month
- **Vercel**: Unlimited for personal projects
  - 100GB bandwidth/month
  - Perfect for portfolios

**If you exceed free tier:**
- Railway: Pay as you go (~$10-20/month)
- Vercel: Still free for personal use!

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
```
Solution:
1. Check REACT_APP_BACKEND_URL in Vercel
2. Make sure it includes https:// and no trailing slash
3. Verify Railway backend is running (green status)
```

### "Images not loading"
```
Solution:
1. Check image URLs include /api/uploads/ prefix
2. Verify uploads folder exists in Railway
3. Re-upload images via admin dashboard
```

### "Admin login not working"
```
Solution:
1. Check Railway backend logs for errors
2. Verify MongoDB connection is active
3. Try default credentials: admin / admin123
```

### "CORS Error"
```
Solution:
1. Backend CORS is set to allow all origins
2. If still issues, check browser console for exact error
3. Verify REACT_APP_BACKEND_URL is exactly your Railway domain
```

---

## 📞 Need Help?

If you encounter issues:
1. Check Railway logs: Project → Backend Service → Deployments → Logs
2. Check Vercel logs: Project → Deployments → Your deployment → Function Logs
3. Check browser console (F12) for frontend errors

---

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., yourname.com)
3. Update DNS records as instructed by Vercel
4. SSL certificate is automatic!

---

## ⚡ Performance Tips

1. **Image Optimization**: Already handled by React build
2. **CDN**: Vercel provides global CDN automatically
3. **Caching**: Vercel handles this out of the box
4. **Backend**: Railway has built-in caching

Your portfolio will be FAST! ⚡

---

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Keep MongoDB credentials secure (Railway handles this)
- [ ] Use HTTPS only (automatic on both platforms)
- [ ] Don't commit .env files to GitHub

---

## 📊 Monitoring

**Check your app status:**
- Railway: https://railway.app/project/YOUR_PROJECT
- Vercel: https://vercel.com/YOUR_USERNAME/YOUR_PROJECT

Both platforms provide:
- Uptime monitoring
- Usage analytics
- Deployment logs
- Error tracking

---

## ✨ You're All Set!

Your photography portfolio is now live at:
- 🌐 **Frontend**: https://your-portfolio.vercel.app
- ⚙️ **Backend**: https://your-app.up.railway.app
- 🗄️ **Database**: Managed by Railway

Share your work with the world! 📸
