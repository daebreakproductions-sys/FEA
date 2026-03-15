#!/usr/bin/env node

/**
 * Generate cleanup summary for locations without coordinates
 * This script analyzes both data sources and creates a report
 * of locations that need geocoding
 */

const fs = require('fs');
const path = require('path');

// Paths to data files
const foodResourcesPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json');
const marketsCSVPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'markets.csv');

// Output file
const outputPath = path.join(__dirname, '..', 'LOCATIONS_NEEDING_GEOCODING.md');

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function loadFoodResources() {
  try {
    const data = fs.readFileSync(foodResourcesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading food_resources.json:', error.message);
    return [];
  }
}

function loadMarketsCSV() {
  try {
    const data = fs.readFileSync(marketsCSVPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    const idIndex = headers.indexOf('id');
    const nameIndex = headers.indexOf('name');
    const addressIndex = headers.indexOf('address');
    const latIndex = headers.indexOf('lat');
    const lngIndex = headers.indexOf('lng');
    
    const markets = [];
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      markets.push({
        id: fields[idIndex]?.trim(),
        name: fields[nameIndex]?.trim(),
        address: fields[addressIndex]?.trim(),
        lat: fields[latIndex]?.trim(),
        lng: fields[lngIndex]?.trim(),
        source: 'markets.csv'
      });
    }
    return markets;
  } catch (error) {
    console.error('Error loading markets.csv:', error.message);
    return [];
  }
}

function analyzeLocations() {
  console.log('Analyzing locations for missing coordinates...');
  
  const foodResources = loadFoodResources();
  const markets = loadMarketsCSV();
  
  const locationsWithoutCoords = [];
  
  // Analyze food resources
  foodResources.forEach(item => {
    if (!item.lat || !item.lng || item.lat === 0 || item.lng === 0) {
      locationsWithoutCoords.push({
        id: item.id,
        name: item.name,
        address: item.address,
        type: item.type || 'FoodResource',
        source: 'food_resources.json',
        lat: item.lat,
        lng: item.lng
      });
    }
  });
  
  // Analyze markets
  markets.forEach(item => {
    if (!item.lat || !item.lng || item.lat === '' || item.lng === '') {
      locationsWithoutCoords.push({
        id: item.id,
        name: item.name,
        address: item.address,
        type: 'Market',
        source: 'markets.csv',
        lat: item.lat,
        lng: item.lng
      });
    }
  });
  
  return locationsWithoutCoords;
}

function generateReport() {
  const locationsWithoutCoords = analyzeLocations();
  const foodResources = loadFoodResources();
  const markets = loadMarketsCSV();
  
  const report = `# Locations Needing Geocoding

## Summary
- **Total locations analyzed**: ${foodResources.length + markets.length}
- **Locations without coordinates**: ${locationsWithoutCoords.length}
- **Food resources without coordinates**: ${locationsWithoutCoords.filter(l => l.source === 'food_resources.json').length}
- **Markets without coordinates**: ${locationsWithoutCoords.filter(l => l.source === 'markets.csv').length}

## Locations Requiring Geocoding

| ID | Name | Address | Type | Source | Current Coordinates |
|---|---|---|---|---|---|
${locationsWithoutCoords.map(loc => `| ${loc.id || 'N/A'} | ${loc.name || 'Unknown'} | ${loc.address || 'No address'} | ${loc.type} | ${loc.source} | ${loc.lat || 'N/A'}, ${loc.lng || 'N/A'} |`).join('\n')}

## Geocoding Recommendations

1. **Priority Order**:
   - Food pantries and meal sites (essential services)
   - Farmers markets (seasonal)
   - Food retailers (grocery stores)

2. **Geocoding Sources**:
   - Google Maps Geocoding API
   - OpenStreetMap Nominatim
   - US Census Geocoder

3. **Data Quality Notes**:
   - Some locations may have incomplete addresses
   - Verify addresses before geocoding
   - Check for duplicate entries

## Next Steps

1. Review addresses for accuracy
2. Use geocoding service to get coordinates
3. Update source files with new coordinates
4. Re-run data validation script
5. Test map rendering with updated data

---
*Generated on: ${new Date().toISOString()}*
`;
  
  fs.writeFileSync(outputPath, report);
  console.log(`Cleanup summary generated: ${outputPath}`);
  console.log(`Found ${locationsWithoutCoords.length} locations without coordinates`);
  
  return locationsWithoutCoords;
}

// Run the analysis
const results = generateReport();
console.log('\nAnalysis complete!');
console.log(`- Food resources: ${loadFoodResources().length} total`);
console.log(`- Markets: ${loadMarketsCSV().length} total`);
console.log(`- Missing coordinates: ${results.length}`);
