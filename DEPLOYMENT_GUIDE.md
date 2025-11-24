# Photography Portfolio - Deployment Guide

This guide provides step-by-step instructions for deploying your photography portfolio to **Railway** and **Vercel**.

---

## 🚂 Option 1: Railway Deployment (Full-Stack)

Railway is ideal for deploying both your backend (FastAPI) and frontend (React) together, along with MongoDB.

### Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)
- This project pushed to a GitHub repository

### Step-by-Step Guide

#### 1. Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

#### 2. Create Railway Project
1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your photography portfolio repository
5. Railway will detect your project structure

#### 3. Set Up MongoDB
1. In your Railway project, click **"+ New"**
2. Select **"Database" → "MongoDB"**
3. Railway will provision a MongoDB instance
4. Copy the `MONGO_URL` connection string from the MongoDB service variables

#### 4. Configure Backend Service
1. Click on your backend service
2. Go to **"Variables"** tab
3. Add environment variables:
   ```
   MONGO_URL=<paste MongoDB connection string from step 3>
   PORT=8001
   ```
4. Go to **"Settings"** tab
5. Set **Root Directory**: `backend`
6. Set **Start Command**: `uvicorn server:app --host 0.0.0.0 --port 8001`
7. Click **"Deploy"**

#### 5. Configure Frontend Service
1. Click **"+ New"** → **"Empty Service"**
2. Connect your GitHub repo again
3. Go to **"Variables"** tab
4. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=<your-railway-backend-url>
   ```
   (You'll get this URL from your backend service after it deploys)
5. Go to **"Settings"** tab
6. Set **Root Directory**: `frontend`
7. Set **Build Command**: `yarn build`
8. Set **Start Command**: `yarn start`
9. Click **"Deploy"**

#### 6. Update Backend URL
1. Once backend deploys, copy its public URL
2. Go to frontend service **"Variables"**
3. Update `REACT_APP_BACKEND_URL` with the backend URL
4. Redeploy frontend

#### 7. Generate Domain (Optional)
1. Go to frontend service **"Settings"**
2. Click **"Generate Domain"** to get a public URL
3. Your portfolio is now live!

### Railway Pricing
- **Free Tier**: $5 of usage per month (usually sufficient for small apps)
- **Pro Plan**: $20/month for production apps

---

## ▲ Option 2: Vercel Deployment (Frontend) + Railway (Backend)

This hybrid approach uses Vercel for frontend (optimized for React) and Railway for backend + database.

### Part A: Deploy Backend + Database on Railway

Follow **Steps 1-4** from the Railway guide above to deploy your FastAPI backend and MongoDB.

### Part B: Deploy Frontend on Vercel

#### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Your GitHub repository

#### Step-by-Step Guide

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Import Project to Vercel
1. Go to https://vercel.com and sign in
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a React app

#### 3. Configure Build Settings
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `yarn build`
4. **Output Directory**: `build`
5. **Install Command**: `yarn install`

#### 4. Add Environment Variables
1. In the **"Environment Variables"** section, add:
   ```
   REACT_APP_BACKEND_URL=<your-railway-backend-url>
   ```
   (Use the backend URL from Railway)

#### 5. Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. You'll get a production URL like: `your-portfolio.vercel.app`

#### 6. Custom Domain (Optional)
1. Go to **"Settings" → "Domains"**
2. Add your custom domain
3. Update DNS records as instructed

### Vercel Pricing
- **Hobby (Free)**: Perfect for personal portfolios
- **Pro**: $20/month for commercial use

---

## 🆚 Railway vs Vercel Comparison

| Feature | Railway | Vercel (Frontend) + Railway (Backend) |
|---------|---------|---------------------------------------|
| **Ease of Setup** | Medium (Full-stack in one place) | Easy (Frontend) + Medium (Backend) |
| **Performance** | Good | Excellent (Vercel CDN for frontend) |
| **Free Tier** | $5 credit/month | Unlimited (Vercel) + $5 (Railway backend) |
| **Best For** | All-in-one solution | Production-grade frontend performance |
| **Cost** | $20-30/month for production | $20/month (Vercel Pro) + Railway backend |

---

## 📋 Post-Deployment Checklist

### 1. Update CORS Settings
If you get CORS errors, update `backend/server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Test Admin Login
- Navigate to: `your-domain.com/admin/login`
- Test with credentials: admin / admin123
- Change default password in production!

### 3. Upload Content
1. Login to admin dashboard
2. Upload projects and images
3. Configure site settings (brand name, about, contacts)

### 4. Test All Features
- ✅ Homepage slideshow
- ✅ Project pages
- ✅ About modal
- ✅ Admin CRUD operations
- ✅ Image uploads
- ✅ Mobile responsive design

---

## 🐛 Troubleshooting

### Backend Not Connecting
```bash
# Check MongoDB connection string in Railway variables
# Ensure it includes: mongodb://user:password@host:port/database
```

### Frontend Shows API Errors
```bash
# Verify REACT_APP_BACKEND_URL is correct
# Check browser console for CORS errors
# Ensure backend URL uses https:// (not http://)
```

### Images Not Loading
```bash
# Check /api/uploads/ path is accessible
# Verify Railway backend has persistent storage
# Re-upload images via admin dashboard
```

### Build Failures
```bash
# Frontend: Check package.json dependencies
# Backend: Check requirements.txt is complete
# Run build locally first: yarn build (frontend)
```

---

## 🔒 Security Recommendations

1. **Change Default Admin Password**
   - Update in admin settings after first login

2. **Set Strong MongoDB Password**
   - Use Railway's auto-generated credentials

3. **Enable HTTPS Only**
   - Both Railway and Vercel provide SSL by default

4. **Rate Limiting** (Optional)
   - Add to FastAPI for production security

---

## 📊 Monitoring

### Railway
- View logs: Service → Deployments → Logs
- Monitor usage: Project → Usage tab

### Vercel
- View analytics: Project → Analytics
- Check logs: Project → Deployments → Function Logs

---

## 💡 Recommendations

**For This Photography Portfolio:**

1. **Recommended Setup**: Vercel (Frontend) + Railway (Backend + MongoDB)
   - **Why**: Best performance for image-heavy frontend
   - **Cost**: Free tier works well for portfolios
   - **Scalability**: Easy to upgrade as traffic grows

2. **Alternative**: Full Railway Deployment
   - **Why**: Simpler setup, everything in one place
   - **Cost**: Similar pricing
   - **Good for**: Quick deployment, less configuration

---

## 📞 Support

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/support
- **Emergent Platform**: support@emergent.sh

---

## 🎉 Success!

Once deployed, your portfolio will be live at:
- **Vercel**: `https://your-portfolio.vercel.app`
- **Railway**: `https://your-portfolio.up.railway.app`

Share your photography with the world! 📸
