# Railway Docker Build Error - Fix Guide

## 🔍 **Error Message**

```
/bin/bash: line 1: pip: command not found
ERROR: failed to build: failed to solve: process '/bin/bash -ol pipefail -c pip install --upgrade pip' did not complete successfully: exit code: 127
Error: Docker build failed
```

---

## 🎯 **Root Cause**

Railway is trying to use **Docker builder** instead of **Nixpacks builder**, but there was no Dockerfile, causing the build to fail.

---

## ✅ **Solutions Applied**

We've implemented **both** solutions so Railway can work either way:

### **Solution 1: Dockerfile Created** ✅

Created `/app/backend/Dockerfile`:
- Uses Python 3.11-slim base image
- Installs dependencies from requirements.txt
- Creates uploads directory
- Starts uvicorn server on $PORT

### **Solution 2: Configuration Files Updated** ✅

- ✅ `Dockerfile` - For Docker mode
- ✅ `.dockerignore` - Optimizes Docker builds
- ✅ `railway.json` - Specifies Nixpacks builder
- ✅ `nixpacks.toml` - Nixpacks configuration
- ✅ `Procfile` - Process definition
- ✅ `runtime.txt` - Python version (3.11)

---

## 🚀 **How to Fix in Railway Dashboard**

### **Option A: Use Nixpacks (Recommended)**

This is faster and Railway's preferred method for Python apps.

**Steps:**
1. Go to **Railway Dashboard**
2. Click on your **amlgmt** project
3. Click **Settings** tab
4. Scroll to **"Build"** section
5. Find **"Builder"** dropdown
6. Select **"Nixpacks"**
7. Click **Save** (if needed)
8. Go to **Deployments** → Click **"Redeploy"**

**Why Nixpacks?**
- ✅ Automatically detects Python
- ✅ Faster builds
- ✅ Optimized for Railway
- ✅ No Dockerfile needed

---

### **Option B: Use Docker (Automatic)**

Since we created a Dockerfile, Railway will automatically use Docker mode.

**Steps:**
1. Just **push to GitHub**
2. Railway will detect the Dockerfile
3. Builds using Docker automatically

**Why Docker?**
- ✅ More control over build process
- ✅ Explicit dependencies
- ✅ Same as production image

---

## 📋 **Railway Settings Checklist**

Verify these settings in Railway Dashboard:

### **Settings → Source:**
```
✅ Root Directory: backend
✅ Branch: main
✅ Wait for CI: OFF
```

### **Settings → Build:**
```
✅ Builder: Nixpacks (or auto-detect for Docker)
```

### **Settings → Deploy:**
```
✅ Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### **Variables:**
```
✅ MONGO_URL: (your MongoDB connection string)
✅ DB_NAME: photography_portfolio
❌ PORT: (remove if exists - Railway sets this)
```

---

## 🔄 **Deployment Process**

### **Step 1: Push to GitHub**

```bash
cd /app
git push origin main
```

### **Step 2: Railway Auto-Detects**

Railway will:
1. Detect the Dockerfile (if using Docker mode)
2. Or use railway.json configuration (if using Nixpacks)
3. Start building

### **Step 3: Build Process**

**With Docker:**
```
Pulling python:3.11-slim
Installing system dependencies
Installing Python packages
Copying application code
Creating uploads directory
Starting server
```

**With Nixpacks:**
```
Detecting Python 3.11
Installing dependencies
Setting up environment
Starting server
```

### **Step 4: Verification**

After 3-5 minutes:
```bash
curl https://amlgmt-production.up.railway.app/api/health
```

Expected: `{"status":"healthy"}`

---

## 📊 **Build Comparison**

| Feature | Nixpacks | Docker |
|---------|----------|--------|
| Speed | ⚡ Faster | 🐢 Slower |
| Config | Minimal | Explicit |
| Control | Less | More |
| Railway Native | ✅ Yes | No |
| Our Setup | ✅ Ready | ✅ Ready |

**Recommendation:** Use **Nixpacks** (Option A) for faster builds.

---

## 🐛 **Troubleshooting**

### **Error: "Builder not specified"**

**Fix:** Set builder in Settings → Build → Builder → Nixpacks

---

### **Error: "requirements.txt not found"**

**Fix:** Verify Root Directory is `backend` (not `/backend`)

---

### **Error: "pip command not found" (still)**

**Fix:** 
1. Railway is using wrong builder
2. Go to Settings → Build
3. Change to Nixpacks
4. Redeploy

---

### **Error: "Module not found"**

**Fix:** 
1. Check requirements.txt has all dependencies
2. Make sure Root Directory is correct
3. Redeploy

---

## 📝 **Files Created/Updated**

| File | Purpose | Status |
|------|---------|--------|
| `backend/Dockerfile` | Docker build instructions | ✅ Created |
| `backend/.dockerignore` | Docker build optimization | ✅ Created |
| `backend/runtime.txt` | Python version (3.11) | ✅ Updated |
| `backend/railway.json` | Railway config (Nixpacks) | ✅ Exists |
| `backend/nixpacks.toml` | Nixpacks config | ✅ Exists |
| `backend/Procfile` | Process definition | ✅ Exists |

---

## ✅ **What to Do Now**

### **Quick Fix (2 minutes):**

1. **Go to Railway Settings**
2. **Change Builder to "Nixpacks"**
3. **Click "Redeploy"**
4. **Wait 3-5 minutes**
5. **Check deployment status**

### **Alternative (Automatic):**

1. **Push to GitHub** (if not auto-synced)
2. **Railway auto-detects Dockerfile**
3. **Builds with Docker**
4. **Wait 5-7 minutes** (Docker is slower)
5. **Check deployment status**

---

## 🎯 **Expected Timeline**

### **With Nixpacks:**
```
Now       → Change builder setting
+30 sec   → Redeploy triggered
+2 min    → Building...
+3 min    → ✅ ACTIVE
```

### **With Docker:**
```
Now       → Push to GitHub
+30 sec   → Railway detects push
+3 min    → Building image...
+5 min    → Starting container...
+6 min    → ✅ ACTIVE
```

---

## 🎉 **Success Indicators**

### **Railway Dashboard:**
- ✅ Deployment status: **"ACTIVE"**
- ✅ Logs show: `Uvicorn running on http://0.0.0.0:XXXX`
- ✅ No error messages

### **API Test:**
```bash
curl https://amlgmt-production.up.railway.app/api/health
# Returns: {"status":"healthy"}
```

### **Vercel Frontend:**
- ✅ Loads without blank screen
- ✅ No CORS errors in console
- ✅ Projects display correctly

---

## 📞 **Next Steps**

1. ✅ **Change Railway builder to Nixpacks** (recommended)
   - OR -
2. ✅ **Let Railway use Docker** (automatic with our Dockerfile)
3. ✅ **Push to GitHub** (if needed)
4. ✅ **Wait 3-5 minutes**
5. ✅ **Verify deployment is ACTIVE**
6. ✅ **Test your site!**

---

## 🆘 **If Still Failing**

Share:
1. Screenshot of Railway logs (full error)
2. Screenshot of Settings → Build section
3. Current Root Directory setting

We'll troubleshoot from there!

---

**Status:** Configuration complete! Railway should build successfully now with either Nixpacks or Docker. 🚀
