# Custom Domain Setup Guide

## 🎯 Current CORS Configuration

Your backend is now configured to automatically accept requests from:

### ✅ Automatically Allowed (No Changes Needed)
- `http://localhost:3000` - Local development
- `https://amlgmt.vercel.app` - Production Vercel domain
- `https://*.vercel.app` - **ALL Vercel preview/branch deployments** (future-proof!)
- `https://amlgmt-production.up.railway.app` - Railway backend

---

## 🌐 Adding a Custom Domain (e.g., www.amalgamate.com)

When you're ready to add your own custom domain, follow these steps:

### Step 1: Add Domain to Vercel
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `amalgamate.com` or `www.amalgamate.com`)
4. Follow Vercel's DNS configuration instructions

### Step 2: Update Backend CORS Configuration

**Edit**: `/app/backend/server.py`

Find the CORS middleware section (around line 450) and add your custom domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_origins=[
        "http://localhost:3000",
        "https://amlgmt.vercel.app",
        "https://amlgmt-production.up.railway.app",
        "https://amalgamate.com",           # Add your custom domain
        "https://www.amalgamate.com",       # Add www version if needed
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3: Deploy Backend Changes to Railway

**Option A: Push to GitHub (Automatic)**
```bash
git add .
git commit -m "Add custom domain to CORS"
git push origin main
```
Railway will automatically detect and deploy the changes.

**Option B: Manual Railway Redeploy**
1. Go to Railway dashboard
2. Click on your `amlgmt-production` service
3. Click **"Redeploy"**

### Step 4: Update Frontend Environment Variable (If Needed)

Your frontend uses `REACT_APP_BACKEND_URL` which points to Railway. This doesn't need to change when you add a custom frontend domain.

However, if you decide to move your backend to a custom domain too:

**In Vercel Settings → Environment Variables:**
- Update `REACT_APP_BACKEND_URL` to point to your custom backend domain
- Redeploy frontend

---

## 🔒 Security Best Practices

### Current Setup (Secure)
✅ **Wildcard for Vercel only**: We use `allow_origin_regex=r"https://.*\.vercel\.app"` to allow all your Vercel deployments
✅ **Specific domains for production**: Custom domains are explicitly listed
✅ **Credentials enabled**: Allows cookies/auth tokens

### Future Considerations

**If you have multiple custom domains:**
```python
allow_origins=[
    "http://localhost:3000",
    "https://amlgmt.vercel.app",
    "https://amlgmt-production.up.railway.app",
    "https://amalgamate.com",
    "https://www.amalgamate.com",
    "https://app.amalgamate.com",  # If you have subdomains
    "https://admin.amalgamate.com",
]
```

**If you want to allow ALL domains (NOT RECOMMENDED for production):**
```python
allow_origins=["*"]  # ⚠️ Only for development/testing
```

---

## 🧪 Testing CORS for New Domains

To test if CORS is working for a new domain:

### Method 1: Browser DevTools (Easiest)
1. Visit your custom domain
2. Open DevTools (F12) → Console
3. Look for CORS errors
4. If you see: "Access-Control-Allow-Origin: [your-domain]" ✅ Working!

### Method 2: curl Test (Advanced)
```bash
curl -X OPTIONS https://amlgmt-production.up.railway.app/api/auth/login \
  -H "Origin: https://your-custom-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep "access-control-allow-origin"
```

Expected output:
```
< access-control-allow-origin: https://your-custom-domain.com
```

---

## 🚨 Troubleshooting CORS Issues

### Problem: "Origin is not allowed by Access-Control-Allow-Origin"

**Solution 1: Check if domain is in allow_origins list**
- Verify the exact domain name (with/without www, http vs https)
- Make sure there are no typos

**Solution 2: Wait for deployment**
- Changes to `server.py` need to be deployed to Railway
- Check Railway deployment status
- Can take 2-3 minutes

**Solution 3: Clear browser cache**
- CORS headers can be cached
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Problem: Preview deployment CORS error

**This should NOT happen anymore!** Our `allow_origin_regex=r"https://.*\.vercel\.app"` handles all Vercel deployments.

If it still occurs:
1. Check if the domain matches the regex pattern
2. Verify backend has restarted with new config
3. Check Railway logs for errors

---

## 📝 Quick Reference

### Files to Update for Custom Domains

| Change | File | What to Update |
|--------|------|----------------|
| **Backend CORS** | `/app/backend/server.py` | Add domain to `allow_origins` list |
| **Frontend API URL** | Vercel Environment Variables | Update `REACT_APP_BACKEND_URL` (only if backend domain changes) |

### Deployment Checklist

- [ ] Update `server.py` with new domain
- [ ] Commit and push to GitHub
- [ ] Verify Railway auto-deploys changes
- [ ] Test custom domain in browser
- [ ] Check DevTools console for CORS errors
- [ ] Verify login/functionality works

---

## 🎉 Summary

Your CORS setup is now **future-proof** for:
- ✅ All Vercel preview deployments (automatic)
- ✅ Production Vercel domain
- ✅ Railway backend
- ✅ Easy to add custom domains (just add to list)

**When you add a custom domain, you only need to:**
1. Add it to the `allow_origins` list in `server.py`
2. Push to GitHub (Railway auto-deploys)
3. Wait 2-3 minutes
4. Done! 🚀

---

## 📞 Need Help?

If you encounter any issues:
1. Check Railway logs: `Railway Dashboard → Service → Logs`
2. Check Vercel logs: `Vercel Dashboard → Deployments → View Logs`
3. Check browser console for specific error messages
4. Verify environment variables are set correctly
