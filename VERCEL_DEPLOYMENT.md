# 🚀 Vercel Deployment Guide for Flint Eats

## Quick Deploy (3 Steps)

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Configure Build (Already Done)**
✅ `vercel.json` created with Ionic/Angular settings
✅ Build output directory: `www`

### **Step 3: Deploy**
```bash
vercel
```

**Follow Prompts:**
- Set up and deploy? **Yes**
- Link to existing project? **No**
- Which scope? **[your-username]**
- Project name? **flint-eats**
- Directory? **./**

**Result:** Your app will be live at `https://flint-eats.vercel.app`

---

## 📋 What Gets Deployed

**Web Preview Features:**
- ✅ All 967 locations on interactive map
- ✅ Color-coded markers (Green/Blue/Purple)
- ✅ Search and filter functionality
- ✅ Admin panel at `/admin`
- ✅ Responsive mobile layout

**Limitations (Web vs Native):**
- ⚠️ GPS location uses browser geolocation (not as precise)
- ⚠️ Native plugins (haptics, camera) won't work
- ⚠️ App store deployment requires separate Capacitor build

---

## 🔧 Configuration Details

### **vercel.json**
```json
{
  "version": 2,
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "www" }
  }],
  "routes": [{
    "src": "/(.*)",
    "dest": "/index.html"
  }]
}
```

### **Build Process**
1. Vercel detects Angular/Ionic project
2. Runs `npm run build` (production mode)
3. Outputs to `www/` folder
4. Serves as static SPA with routing support

---

## 🔄 Continuous Deployment

**Automatic Deploys:**
```bash
# Push to git triggers auto-deploy
git add .
git commit -m "Update locations data"
git push origin main

# Vercel automatically rebuilds and deploys
```

**Manual Deploy:**
```bash
vercel --prod
```

---

## 🌍 Environment Variables (Optional)

```bash
# Add API keys or config
vercel env add API_URL
vercel env add MAP_API_KEY

# Deploy with env vars
vercel
```

---

## 📊 Deployment Checklist

Before deploying:
- [ ] Run `node scripts/pre_git_test.js` - all tests pass
- [ ] Test locally: `ionic serve`
- [ ] Verify all 967 locations load
- [ ] Check admin panel at `/admin`
- [ ] Confirm color coding works

After deploying:
- [ ] Test live URL on mobile device
- [ ] Verify map loads all markers
- [ ] Test search functionality
- [ ] Check admin access

---

## 🚀 Production vs Development

| Feature | Vercel (Web) | Mobile App (Capacitor) |
|---------|--------------|------------------------|
| Map | ✅ Works | ✅ Works |
| GPS | ⚠️ Browser GPS | ✅ Native GPS |
| Offline | ❌ No | ✅ Yes (with service worker) |
| App Store | ❌ No | ✅ iOS/Android stores |
| Push Notifications | ❌ No | ✅ Yes |

---

## 🛠️ Troubleshooting

**"Build failed"**
```bash
# Check build locally first
npm run build
# Fix any errors, then redeploy
vercel
```

**"404 on routes"**
- ✅ `vercel.json` handles SPA routing
- Refresh page works correctly

**"Map not loading"**
- Check browser console for CORS errors
- Verify API keys in environment variables

---

## 📱 Testing Deployed App

**Mobile Browser Test:**
1. Open `https://flint-eats.vercel.app` on iPhone/Android
2. Add to Home Screen (creates PWA feel)
3. Test all features: map, search, admin

**Desktop Test:**
1. Open in Chrome/Firefox
2. DevTools → Toggle Device Toolbar
3. Test responsive layouts

---

## 🎯 Next Steps After Deploy

1. **Test thoroughly** on the live URL
2. **Share URL** with stakeholders for review
3. **Fix any issues** locally, then redeploy
4. **When ready**, build native apps:
   ```bash
   ionic capacitor build ios
   ionic capacitor build android
   ```

---

## 📚 Resources

- **Live Preview**: https://flint-eats.vercel.app (after deploy)
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Ionic Docs**: https://ionicframework.com/docs
- **Pre-git Testing**: `node scripts/pre_git_test.js`

---

**Ready to deploy? Run: `vercel`**