import { Injectable } from '@angular/core';
import { EatsLocation, FoodResourceType } from '@app/models/eats-location';
import { Position } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { HelperService } from './helper-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EatsLocationsService {
  public eatsLocations: EatsLocation[] = [];
  readonly pageSize: number = 200;
  public notifier: Subject<EatsLocation[]> = new Subject<EatsLocation[]>();
  private _doneLoading: boolean = false;

  constructor(
    public helpers: HelperService,
    private http: HttpClient,
  ) { }

  /**
   * Initialize the service by loading data from local JSON/CSV files
   * This replaces the previous API-based loading with direct file loading
   */
  init() {
    this.eatsLocations = [];
    this._doneLoading = false;
    
    // Load both data sources
    Promise.all([
      this.loadFoodResources(),
      this.loadMarketsCSV()
    ]).then(() => {
      this._doneLoading = true;
      this.notifier.next(this.eatsLocations);
      this.notifier.complete();
    }).catch(err => {
      console.error('Error loading location data:', err);
      this._doneLoading = true;
      this.notifier.next(this.eatsLocations);
      this.notifier.complete();
    });
  }

  /**
   * Load food_resources.json
   */
  private loadFoodResources(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any[]>('assets/data/food_resources.json')
        .subscribe({
          next: (data) => {
            const mappedData = data.map(item => this.mapFoodResourceToEatsLocation(item));
            this.eatsLocations = this.eatsLocations.concat(mappedData);
            resolve();
          },
          error: (err) => {
            console.error('Error loading food_resources.json:', err);
            resolve();
          }
        });
    });
  }

  /**
   * Load markets CSV and convert to EatsLocation format
   */
  private loadMarketsCSV(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get('assets/data/markets.csv', { responseType: 'text' })
        .subscribe({
          next: (csvText) => {
            const markets = this.parseMarketsCSV(csvText);
            const mappedMarkets = markets.map(item => this.mapMarketToEatsLocation(item));
            this.eatsLocations = this.eatsLocations.concat(mappedMarkets);
            resolve();
          },
          error: (err) => {
            console.error('Error loading markets.csv:', err);
            resolve();
          }
        });
    });
  }

  /**
   * Parse markets CSV with proper quote handling
   */
  private parseMarketsCSV(csvText: string): any[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = this.parseCSVLine(lines[0]);
    const idIndex = headers.indexOf('id');
    const nameIndex = headers.indexOf('name');
    const addressIndex = headers.indexOf('address');
    const latIndex = headers.indexOf('lat');
    const lngIndex = headers.indexOf('lng');
    const hoursIndex = headers.indexOf('hours');
    const phoneIndex = headers.indexOf('phone');
    const ebtIndex = headers.indexOf('ebt_accepted');
    const dufbIndex = headers.indexOf('dufb_offered');
    const wicIndex = headers.indexOf('wic_accepted');

    const markets = [];
    for (let i = 1; i < lines.length; i++) {
      const fields = this.parseCSVLine(lines[i]);
      const lat = fields[latIndex]?.trim();
      const lng = fields[lngIndex]?.trim();
      
      if (lat && lng) {
        markets.push({
          id: fields[idIndex]?.trim(),
          name: fields[nameIndex]?.trim(),
          address: fields[addressIndex]?.trim(),
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          hours: fields[hoursIndex]?.trim(),
          phone: fields[phoneIndex]?.trim(),
          ebt_accepted: fields[ebtIndex]?.trim() === '1',
          dufb_offered: fields[dufbIndex]?.trim() === '1',
          wic_accepted: fields[wicIndex]?.trim() === '1'
        });
      }
    }
    return markets;
  }

  /**
   * Parse a single CSV line with quote handling
   */
  private parseCSVLine(line: string): string[] {
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

  /**
   * Map market CSV data to EatsLocation interface
   */
  private mapMarketToEatsLocation(item: any): EatsLocation {
    return {
      id: item.id || 0,
      name: item.name || 'Unknown',
      address: item.address || '',
      lat: item.lat,
      lng: item.lng,
      provider_type: 'FoodRetailer',
      class: 'Market',
      ebt_accepted: item.ebt_accepted || false,
      dufb_offered: item.dufb_offered || false,
      wic_accepted: item.wic_accepted || false,
      hours: item.hours || '',
      phone: item.phone || '',
      url: '',
      notes: '',
      food_categories_list: ['Groceries', 'Canned Goods', 'Convenience Items']
    };
  }

  /**
   * Map food resource data from JSON to EatsLocation interface
   */
  private mapFoodResourceToEatsLocation(item: any): EatsLocation {
    let providerType: FoodResourceType = 'FoodRetailer';
    if (item.type === 'FoodPantry') {
      providerType = 'FoodPantry';
    } else if (item.type === 'FarmersMarket') {
      providerType = 'FarmersMarket';
    } else if (item.type === 'FoodRetailer') {
      providerType = 'FoodRetailer';
    }

    const classType = providerType === 'FoodPantry' ? 'FoodPantry' : 'Market';

    return {
      id: item.id || 0,
      name: item.name || 'Unknown',
      address: item.address || '',
      lat: item.lat,
      lng: item.lng,
      provider_type: providerType,
      class: classType,
      ebt_accepted: item.ebt_accepted === 1 || item.ebt_accepted === true,
      dufb_offered: item.dufb_offered === 1 || item.dufb_offered === true,
      wic_accepted: item.wic_accepted === 1 || item.wic_accepted === true,
      hours: item.hours || '',
      phone: item.phone || '',
      url: item.url || '',
      notes: item.notes || '',
      food_categories_list: this.inferFoodCategories(providerType)
    };
  }

  /**
   * Infer food categories based on provider type for search functionality
   */
  private inferFoodCategories(providerType: FoodResourceType): string[] {
    const categories: Record<FoodResourceType, string[]> = {
      'FarmersMarket': ['Fresh Produce', 'Fruits', 'Vegetables', 'Local Goods', 'Seasonal Items'],
      'FoodRetailer': ['Groceries', 'Canned Goods', 'Fresh Produce', 'Dairy', 'Meat', 'Beverages'],
      'FoodPantry': ['Canned Goods', 'Non-Perishables', 'Emergency Food', 'Dry Goods'],
      'MealSite': ['Prepared Meals', 'Hot Food', 'Community Dining'],
      'MobileMarket': ['Fresh Produce', 'Mobile Distribution', 'Seasonal Items'],
      'WIC_SNAP_Office': ['WIC Services', 'SNAP Assistance', 'Benefits Support']
    };
    return categories[providerType] || ['Food'];
  }

  doneLoading(): boolean {
    return this._doneLoading;
  }

  /**
   * Get nearby locations sorted by distance
   */
  getNearby(location: { coords: {latitude: number, longitude: number}}, numberOfResults: number): { distance: number, eatsLocation: EatsLocation } [] {
    let distances = this.eatsLocations
    .filter(l => {
      return l.lat && l.lng;
    })
    .map(eatsLoc => {
      return { 
        distance: this.helpers.distance(eatsLoc.lat, eatsLoc.lng, location.coords.latitude, location.coords.longitude), 
        eatsLocation: eatsLoc 
      };
    });

    return distances.sort((a,b) => {
      return (a.distance > b.distance) ? 1 : -1;
    }).slice(0, numberOfResults);
  }

  /**
   * Filter locations by search term (inventory items)
   * Implements the "Live-Filtering Search" from documentation
   */
  searchByInventory(searchTerm: string): EatsLocation[] {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return this.eatsLocations;

    return this.eatsLocations.filter(location => {
      if (location.name.toLowerCase().includes(term)) return true;
      if (location.food_categories_list?.some(cat => 
        cat.toLowerCase().includes(term)
      )) return true;
      if (location.address?.toLowerCase().includes(term)) return true;
      return false;
    });
  }

  /**
   * Filter by program flags
   */
  filterByPrograms(options: {
    ebtOnly?: boolean;
    dufbOnly?: boolean;
    wicOnly?: boolean;
  }): EatsLocation[] {
    return this.eatsLocations.filter(location => {
      if (options.ebtOnly && !location.ebt_accepted) return false;
      if (options.dufbOnly && !location.dufb_offered) return false;
      if (options.wicOnly && !location.wic_accepted) return false;
      return true;
    });
  }

  /**
   * Get all unique food categories across all locations
   */
  getAllFoodCategories(): string[] {
    const categories = new Set<string>();
    this.eatsLocations.forEach(loc => {
      loc.food_categories_list?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }
}
