#!/usr/bin/env node

/**
 * Detailed cross-reference analysis for FarmersMarket and DUFB counts
 * This script provides accurate counts by examining both data sources directly
 */

const fs = require('fs');
const path = require('path');

// Paths to data files
const foodResourcesPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'food_resources.json');
const marketsCSVPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'markets.csv');

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
    const ebtIndex = headers.indexOf('ebt_accepted');
    const dufbIndex = headers.indexOf('dufb_offered');
    const wicIndex = headers.indexOf('wic_accepted');
    
    const markets = [];
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      const lat = fields[latIndex]?.trim();
      const lng = fields[lngIndex]?.trim();
      
      if (lat && lng) {
        markets.push({
          id: fields[idIndex]?.trim(),
          name: fields[nameIndex]?.trim(),
          address: fields[addressIndex]?.trim(),
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          type: 'Market',
          ebt_accepted: fields[ebtIndex]?.trim() === '1',
          dufb_offered: fields[dufbIndex]?.trim() === '1',
          wic_accepted: fields[wicIndex]?.trim() === '1',
          source: 'markets.csv'
        });
      }
    }
    return markets;
  } catch (error) {
    console.error('Error loading markets.csv:', error.message);
    return [];
  }
}

function crossReferenceAnalysis() {
  console.log('🔍 Cross-Reference Analysis for FarmersMarket & DUFB Counts\n');
  
  const foodResources = loadFoodResources();
  const markets = loadMarketsCSV();
  
  // Detailed FarmersMarket analysis
  console.log('🌽 FARMERS MARKET ANALYSIS:');
  console.log('├─ Food Resources (type=FarmersMarket):');
  const foodResourceFarmersMarkets = foodResources.filter(item => item.type === 'FarmersMarket');
  foodResourceFarmersMarkets.forEach(market => {
    console.log(`   📍 ${market.name} - ${market.address}`);
  });
  console.log(`   📊 Count: ${foodResourceFarmersMarkets.length}`);
  
  console.log('\n├─ Markets CSV (potential farmers markets):');
  const potentialFarmersMarkets = markets.filter(market => 
    market.name.toLowerCase().includes('farmers') || 
    market.name.toLowerCase().includes('market') ||
    market.name.toLowerCase().includes('produce')
  );
  potentialFarmersMarkets.forEach(market => {
    console.log(`   📍 ${market.name} - ${market.address}`);
  });
  console.log(`   📊 Potential farmers markets: ${potentialFarmersMarkets.length}`);
  
  // DUFB analysis
  console.log('\n💰 DUFB (Double Up Food Bucks) ANALYSIS:');
  console.log('├─ Food Resources with DUFB:');
  const foodResourceDUFB = foodResources.filter(item => item.dufb_offered === true || item.dufb_offered === 1);
  foodResourceDUFB.forEach(location => {
    console.log(`   📍 ${location.name} - ${location.type}`);
  });
  console.log(`   📊 Count: ${foodResourceDUFB.length}`);
  
  console.log('\n├─ Markets CSV with DUFB:');
  const marketsDUFB = markets.filter(market => market.dufb_offered === true);
  marketsDUFB.forEach(market => {
    console.log(`   📍 ${market.name} - ${market.address}`);
  });
  console.log(`   📊 Count: ${marketsDUFB.length}`);
  
  // Corrected totals
  console.log('\n📊 CORRECTED TOTALS:');
  console.log(`├─ Total Farmers Markets: ${foodResourceFarmersMarkets.length}`);
  console.log(`├─ Total DUFB Locations: ${foodResourceDUFB.length + marketsDUFB.length}`);
  console.log(`├─ Total EBT Locations: ${markets.filter(m => m.ebt_accepted).length + foodResources.filter(f => f.ebt_accepted).length}`);
  console.log(`└─ Total WIC Locations: ${markets.filter(m => m.wic_accepted).length + foodResources.filter(f => f.wic_accepted).length}`);
  
  // Data quality issues
  console.log('\n⚠️  DATA QUALITY NOTES:');
  console.log(`├─ Food resources missing type field: ${foodResources.filter(item => !item.type).length}`);
  console.log(`├─ Markets with empty DUFB field: ${markets.filter(market => market.dufb_offered === undefined).length}`);
  console.log(`└─ Total locations analyzed: ${foodResources.length + markets.length}`);
  
  return {
    farmersMarkets: {
      foodResources: foodResourceFarmersMarkets.length,
      markets: 0, // No explicit farmers markets in CSV
      total: foodResourceFarmersMarkets.length
    },
    dufb: {
      foodResources: foodResourceDUFB.length,
      markets: marketsDUFB.length,
      total: foodResourceDUFB.length + marketsDUFB.length
    },
    ebt: {
      foodResources: foodResources.filter(f => f.ebt_accepted).length,
      markets: markets.filter(m => m.ebt_accepted).length,
      total: foodResources.filter(f => f.ebt_accepted).length + markets.filter(m => m.ebt_accepted).length
    },
    wic: {
      foodResources: foodResources.filter(f => f.wic_accepted).length,
      markets: markets.filter(m => m.wic_accepted).length,
      total: foodResources.filter(f => f.wic_accepted).length + markets.filter(m => m.wic_accepted).length
    }
  };
}

// Run the analysis
const results = crossReferenceAnalysis();
console.log('\n📋 SUMMARY REPORT:');
console.log(JSON.stringify(results, null, 2));