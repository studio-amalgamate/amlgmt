# Deployment Updates Guide

## Changes Made

### 1. CORS Configuration Fixed ✅
**File**: `/app/backend/server.py`

**What Changed**:
```python
# Before (allowed all origins)
allow_origins=["*"]

# After (specific domains only)
allow_origins=[
    "http://localhost:3000",
    "https://amlgmt.vercel.app",
    "https://amlgmt-production.up.railway.app"
]
```

**Why**: This fixes the CORS error you were seeing when Vercel tried to communicate with Railway.

---

### 2. Title Bar Updated ✅
**File**: `/app/frontend/public/index.html`

**Changed from**: `Emergent | Fullstack App`  
**Changed to**: `Amalgamate | Photos, Film, Print`

---

### 3. "Made with Emergent" Badge Removed ✅
**File**: `/app/frontend/public/index.html`

**What Changed**: Removed the entire `<a id="emergent-badge">` element that displayed the badge in the bottom-right corner.

---

## How to Deploy These Changes

Since you've already connected your app to Vercel and Railway, deploying is simple:

### Step 1: Push to Your Git Repository
```bash
# From your local machine
git add .
git commit -m "Fix CORS, update title, remove Emergent badge"
git push origin main
```

### Step 2: Automatic Deployment
- **Vercel** will automatically detect the push and rebuild/deploy your frontend (~1-2 minutes)
- **Railway** will automatically detect the push and rebuild/deploy your backend (~2-3 minutes)

### Step 3: Verify
Once both deployments complete:
1. Visit `https://amlgmt.vercel.app`
2. Check the browser tab - should show "Amalgamate | Photos, Film, Print"
3. Check bottom-right corner - "Made with Emergent" badge should be gone
4. Try logging in to admin panel - CORS error should be resolved

---

## Testing the CORS Fix

To test that the CORS issue is resolved:

1. Open your Vercel site: `https://amlgmt.vercel.app`
2. Open browser DevTools (F12) → Console tab
3. Try logging into the admin panel
4. You should **NOT** see any CORS-related errors

**Expected behavior**: The login should work smoothly without any "blocked by CORS policy" errors.

---

## Important Notes

### Adding More Domains Later
If you add more custom domains (like `www.amalgamate.com`), you'll need to update the CORS configuration:

**Edit**: `/app/backend/server.py`
```python
allow_origins=[
    "http://localhost:3000",
    "https://amlgmt.vercel.app",
    "https://amlgmt-production.up.railway.app",
    "https://www.amalgamate.com",  # Add new domain here
]
```

Then push the changes to trigger a new Railway deployment.

---

## Troubleshooting

### CORS Error Still Appears
1. Make sure both Vercel AND Railway deployments have completed
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Railway logs to ensure the new code is running
4. Verify your Vercel domain is exactly `amlgmt.vercel.app` (no typos)

### Title Not Updating
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Vercel deployment logs to ensure build succeeded

---

## Summary

✅ **CORS Fixed**: Backend now accepts requests from your Vercel domain  
✅ **Title Updated**: Browser tab now shows "Amalgamate | Photos, Film, Print"  
✅ **Badge Removed**: "Made with Emergent" no longer appears on the site

**Next step**: Push your code to Git, and both platforms will auto-deploy!
