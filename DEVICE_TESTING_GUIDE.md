# 📱 Flint Eats - Device Testing Guide

**Test the app on iPhone and Android BEFORE committing to git**

---

## 🚀 Quick Start Commands

### **Step 1: Run Pre-Git Tests**
```bash
node scripts/pre_git_test.js
```

### **Step 2: Build the App**
```bash
# Install dependencies (if needed)
npm install

# Build web assets
ionic build

# Sync with mobile platforms
npx cap sync
```

---

## 📱 iOS Testing

### **Option A: iOS Simulator (Mac Required)**

```bash
# Open in Xcode
npx cap open ios

# Or run directly on simulator
ionic capacitor run ios --livereload --external
```

**In Xcode:**
1. Select simulator (iPhone 14/15 recommended)
2. Click **Run** (▶️)
3. App launches automatically

**Test Checklist:**
- [ ] Map loads with all 967 locations
- [ ] Color-coded pins display (Green=FarmersMarket, Blue=Grocery, Purple=Pantries)
- [ ] GPS location works
- [ ] Search filters work (EBT/DUFB/WIC)
- [ ] Admin panel accessible at `/admin`
- [ ] No console errors

---

### **Option B: Physical iPhone**

**Prerequisites:**
- Mac with Xcode
- iPhone with USB cable
- Free Apple ID (no developer account needed for testing)

**Steps:**
```bash
# Build and open Xcode
ionic build
npx cap open ios
```

**In Xcode:**
1. Connect iPhone via USB
2. Select your iPhone from device dropdown
3. Go to **Signing & Capabilities** → Select your Apple ID team
4. Click **Run** (▶️)
5. On iPhone: Settings → Privacy & Security → Developer Mode → Enable
6. Trust the developer certificate when prompted

**Live Reload Testing:**
```bash
# Make changes, see them instantly
ionic capacitor run ios --livereload --external
```

---

## 🤖 Android Testing

### **Option A: Android Emulator**

**Prerequisites:**
- Android Studio installed
- Android SDK configured

**Steps:**
```bash
# Start emulator
# Or use Android Studio: Tools → AVD Manager → Start Emulator

# Run app
ionic capacitor run android --livereload --external
```

**Create Emulator (if needed):**
1. Open Android Studio
2. Tools → AVD Manager → Create Device
3. Select Pixel 6/7, API 33 (Android 13)
4. Download system image if needed
5. Start emulator

---

### **Option B: Physical Android Device**

**Enable Developer Mode:**
1. Settings → About Phone → Tap "Build Number" 7 times
2. Settings → System → Developer Options → Enable
3. Enable "USB Debugging"

**Connect and Run:**
```bash
# Connect phone via USB, allow debugging
ionic capacitor run android --livereload --external
```

**Verify Connection:**
```bash
adb devices
# Should show your device
```

---

## 🧪 Testing Checklist

### **Core Functionality**
- [ ] **Map Rendering**: All 967 locations load within 3 seconds
- [ ] **Color Coding**: 
  - Green pins: Farmers Markets (1 location)
  - Blue pins: Grocery stores (881 locations)
  - Purple pins: Food pantries (85 locations)
- [ ] **GPS Location**: Current location shows correctly
- [ ] **Search**: Type "carrots" → map updates instantly
- [ ] **Filters**: Toggle EBT/DUFB/WIC → results update

### **Admin Features**
- [ ] Navigate to `/admin`
- [ ] View all 967 locations in list
- [ ] Search/filter locations
- [ ] Edit a location
- [ ] Export data (JSON download)
- [ ] Add new location (form validation works)

### **Program Badges**
- [ ] EBT badge shows on eligible locations
- [ ] DUFB badge shows (1 location: Lj'S Farm Market)
- [ ] WIC badge shows on eligible locations

### **Performance**
- [ ] Map pans smoothly
- [ ] Zoom in/out works
- [ ] Popups open quickly
- [ ] No lag when filtering

### **Data Integrity**
- [ ] All coordinates valid (-90 to 90 lat, -180 to 180 lng)
- [ ] No duplicate IDs
- [ ] Provider types correctly assigned

---

## 🔧 Troubleshooting

### **iOS Issues**

**"Signing certificate error"**
```bash
# In Xcode: Signing & Capabilities → Select your team
# Automatic signing should resolve
```

**"Developer Mode not enabled"**
- iPhone: Settings → Privacy & Security → Developer Mode → Enable
- Restart iPhone

**"App won't install"**
- Check USB connection
- Trust computer on iPhone
- Verify Apple ID in Xcode

---

### **Android Issues**

**"ADB not found"**
```bash
# Add to PATH:
export PATH=$PATH:~/Android/Sdk/platform-tools
```

**"App won't install"**
- Enable "Install from USB" in Developer Options
- Check USB debugging is enabled
- Try different USB cable/port

**"Emulator won't start"**
- Increase emulator RAM (2GB minimum)
- Enable hardware acceleration (HAXM/Hypervisor)

---

### **General Issues**

**"Map doesn't load"**
```bash
# Check data files exist
ls src/assets/data/
# Should show: food_resources.json, markets.csv
```

**"White screen"**
```bash
# Open browser console
# Look for errors
ionic serve
```

**"Changes not reflecting"**
```bash
# Rebuild and sync
ionic build
npx cap sync
```

---

## 📋 Pre-Git Commit Checklist

Before committing to git, verify:

```bash
# 1. Run automated tests
node scripts/pre_git_test.js

# 2. Test on iOS simulator
ionic capacitor run ios

# 3. Test on Android emulator
ionic capacitor run android

# 4. Verify all checks pass
```

**Final Verification:**
- [ ] All 967 locations display on map
- [ ] Color coding matches documentation
- [ ] Search works for inventory items
- [ ] Admin panel functional
- [ ] No console errors
- [ ] Performance acceptable (< 3s load)

---

## 🎯 Ready for Git

Once all tests pass:

```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: implement 967 locations with color-coded map icons

- Add all food resources and markets data
- Implement color-coded markers (Green/Blue/Purple)
- Add live-filtering search by inventory
- Create admin panel for data management
- Verify all coordinates valid (0 missing)
- Add comprehensive tagging reference"

# Push to remote
git push origin main
```

---

## 📚 Resources

- **Tagging Reference**: `TAGGING_REFERENCE.md`
- **Data Analysis**: `scripts/cross_reference_analysis.js`
- **Cleanup Summary**: `LOCATIONS_NEEDING_GEOCODING.md`
- **Ionic Docs**: https://ionicframework.com/docs
- **Capacitor Docs**: https://capacitorjs.com/docs

---

**Need Help?** Run `node scripts/pre_git_test.js` to diagnose issues.