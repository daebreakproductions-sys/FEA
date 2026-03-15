#!/usr/bin/env node

/**
 * Fix Vercel Deployment Issues
 * Run this script to diagnose and fix Vercel deployment problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Vercel Deployment Fix\n');

// Check if vercel.json exists
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
  console.log('❌ vercel.json not found. Creating...');
  
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "www"
        }
      }
    ],
    "routes": [
      {
        "handle": "filesystem"
      },
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  };
  
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json created\n');
} else {
  console.log('✅ vercel.json exists\n');
}

// Check if www folder exists after build
console.log('📁 Checking build output...');
const wwwPath = path.join(__dirname, '..', 'www');
if (!fs.existsSync(wwwPath)) {
  console.log('⚠️  www/ folder not found. Building project...\n');
  
  try {
    execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log('✅ Build successful\n');
  } catch (error) {
    console.log('❌ Build failed. Run manually: npm run build\n');
    process.exit(1);
  }
} else {
  console.log('✅ www/ folder exists\n');
}

// Check for index.html in www
const indexPath = path.join(wwwPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.log('❌ index.html not found in www/');
  console.log('   The build may have failed or output to wrong folder.\n');
} else {
  console.log('✅ index.html found in www/\n');
}

// Check package.json for build script
console.log('📦 Checking package.json...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts || !packageJson.scripts.build) {
  console.log('❌ No build script in package.json');
  console.log('   Add: "build": "ng build --configuration production"\n');
} else {
  console.log('✅ Build script: ' + packageJson.scripts.build + '\n');
}

console.log('='.repeat(50));
console.log('🚀 DEPLOYMENT STEPS');
console.log('='.repeat(50));
console.log('');
console.log('1. Make sure all changes are committed:');
console.log('   git add .');
console.log('   git commit -m "Ready for Vercel deploy"');
console.log('');
console.log('2. Deploy to Vercel:');
console.log('   vercel --prod');
console.log('');
console.log('3. If deployment fails, check Vercel dashboard:');
console.log('   https://vercel.com/dashboard');
console.log('');
console.log('4. Common fixes:');
console.log('   - Ensure node_modules are installed: npm install');
console.log('   - Check build logs in Vercel dashboard');
console.log('   - Verify distDir is "www" in vercel.json');
console.log('');
console.log('5. For fresh deploy:');
console.log('   vercel --force');
console.log('');
