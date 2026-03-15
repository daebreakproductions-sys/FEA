#!/usr/bin/env node

/**
 * Pre-Git Testing Script
 * Validates app functionality before committing to git
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Flint Eats Pre-Git Testing\n');

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    tests.passed++;
  } catch (error) {
    console.log(`  ❌ ${name}: ${error.message}`);
    tests.failed++;
  }
}

function warn(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    tests.passed++;
  } catch (error) {
    console.log(`  ⚠️  ${name}: ${error.message}`);
    tests.warnings++;
  }
}

console.log('📦 DATA VALIDATION');
console.log('-------------------');

test('Food resources JSON exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json'));
  if (!exists) throw new Error('food_resources.json not found');
});

test('Markets CSV exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'markets.csv'));
  if (!exists) throw new Error('markets.csv not found');
});

test('Data files are readable', () => {
  const foodResources = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json'), 'utf8'));
  const marketsData = fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'markets.csv'), 'utf8');
  
  if (!Array.isArray(foodResources)) throw new Error('food_resources.json is not an array');
  if (marketsData.split('\n').length < 2) throw new Error('markets.csv appears empty');
});

console.log('\n📱 APP STRUCTURE');
console.log('----------------');

test('Admin page exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'src', 'app', 'pages', 'admin', 'admin.page.ts'));
  if (!exists) throw new Error('Admin page not found');
});

test('Location edit modal exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'src', 'app', 'components', 'location-edit-modal', 'location-edit-modal.component.ts'));
  if (!exists) throw new Error('Location edit modal not found');
});

test('EatsLocationsService exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'src', 'app', 'services', 'eats-locations.service.ts'));
  if (!exists) throw new Error('EatsLocationsService not found');
});

test('Admin route configured', () => {
  const routing = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'app-routing.module.ts'), 'utf8');
  if (!routing.includes("path: 'admin'")) throw new Error('Admin route not found in app routing');
});

console.log('\n🔧 BUILD READINESS');
console.log('-------------------');

warn('Node modules installed', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'node_modules'));
  if (!exists) throw new Error('node_modules not found. Run: npm install');
});

test('package.json valid', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  if (!pkg.dependencies || !pkg.dependencies['@ionic/angular']) {
    throw new Error('Ionic dependencies missing');
  }
});

test('Ionic config valid', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ionic.config.json'), 'utf8'));
  if (!config.name) throw new Error('Ionic config invalid');
});

console.log('\n📊 DATA INTEGRITY');
console.log('-----------------');

test('Location counts accurate', () => {
  const foodResources = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json'), 'utf8'));
  const marketsData = fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'markets.csv'), 'utf8');
  const marketsCount = marketsData.split('\n').filter(line => line.trim() && !line.includes('id,')).length;
  
  const total = foodResources.length + marketsCount;
  if (total !== 967) {
    throw new Error(`Expected 967 locations, found ${total} (Food Resources: ${foodResources.length}, Markets: ${marketsCount})`);
  }
});

test('Coordinates present in data', () => {
  const foodResources = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json'), 'utf8'));
  const withCoords = foodResources.filter(item => item.lat && item.lng).length;
  if (withCoords === 0) throw new Error('No locations with coordinates found');
});

console.log('\n🎨 COLOR CODING');
console.log('----------------');

test('Nearby page has color coding logic', () => {
  const nearbyPage = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'pages', 'nearby', 'nearby.page.ts'), 'utf8');
  if (!nearbyPage.includes('getIconForLocation')) {
    throw new Error('getIconForLocation method not found');
  }
  if (!nearbyPage.includes('FarmersMarket') || !nearbyPage.includes('FoodRetailer')) {
    throw new Error('Provider type color coding not implemented');
  }
});

test('Admin page has color coding', () => {
  const adminPage = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'pages', 'admin', 'admin.page.ts'), 'utf8');
  if (!adminPage.includes('getProviderTypeColor')) {
    throw new Error('getProviderTypeColor method not found in admin');
  }
});

console.log('\n🔍 SEARCH FUNCTIONALITY');
console.log('------------------------');

test('Search by inventory implemented', () => {
  const service = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'services', 'eats-locations.service.ts'), 'utf8');
  if (!service.includes('searchByInventory')) {
    throw new Error('searchByInventory method not found');
  }
  if (!service.includes('food_categories_list')) {
    throw new Error('Food categories not searchable');
  }
});

console.log('\n📋 DOCUMENTATION');
console.log('-----------------');

test('TAGGING_REFERENCE.md exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'TAGGING_REFERENCE.md'));
  if (!exists) throw new Error('Tagging reference not found');
});

test('LOCATIONS_NEEDING_GEOCODING.md exists', () => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'LOCATIONS_NEEDING_GEOCODING.md'));
  if (!exists) throw new Error('Locations cleanup summary not found');
});

console.log('\n' + '='.repeat(50));
console.log('📊 TEST RESULTS');
console.log('='.repeat(50));
console.log(`  ✅ Passed:  ${tests.passed}`);
console.log(`  ⚠️  Warnings: ${tests.warnings}`);
console.log(`  ❌ Failed:   ${tests.failed}`);
console.log('='.repeat(50));

if (tests.failed === 0) {
  console.log('\n🎉 All critical tests passed! Ready for device testing.');
  console.log('\n📱 Next Steps:');
  console.log('  1. Test on iOS: ionic capacitor run ios --livereload --external');
  console.log('  2. Test on Android: ionic capacitor run android --livereload --external');
  console.log('  3. Verify admin panel at /admin');
  console.log('  4. Test map with all 967 locations');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please fix before device testing.');
  process.exit(1);
}