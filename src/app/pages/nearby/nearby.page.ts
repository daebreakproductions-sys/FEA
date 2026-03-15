import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MarketService } from '@app/services/market.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar, Platform } from '@ionic/angular';
import { FeedService } from '@app/services/feed.service';
import { Deal } from '@app/models/deal';
import { EatsLocation } from '@app/models/eats-location';
import { EatsLocationsService } from '@app/services/eats-locations.service';
import { HelperService } from '@app/services/helper-service.service';
import { MapPopupComponent } from '@app/components/map-popup/map-popup.component';
import { InitService } from '@app/services/init-service.service';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Vector as LayerVector } from 'ol/layer';
import { Vector as SourceVector } from 'ol/source';
import { Fill, Icon, Style, Text, Circle, Stroke } from 'ol/style';
import { Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { toStringHDMS } from 'ol/coordinate';
import Overlay from 'ol/Overlay';
import BaseEvent from 'ol/events/Event';
import { MapBrowserEvent } from 'ol';

@Component({
  selector: 'app-nearby',
  templateUrl: 'nearby.page.html',
  styleUrls: ['nearby.page.scss']
})
export class NearbyPage {
  @ViewChild('mapDiv') mapDiv: ElementRef;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild(IonSearchbar) searchBar: any;
  private map: Map;
  private markersLayer: LayerVector;
  private currentLocationLayer: LayerVector;
  private overlayId;
  
  // Color-coded icon styles per documentation
  // Green = Farmers Markets (permanent)
  private iconFarmersMarket: Style;
  // Blue = Grocery/Food Retailers (traditional stores)
  private iconGrocery: Style;
  // Purple = Food Pantries (canned goods symbol)
  private iconFoodPantry: Style;
  // Purple = Meal Sites (fork/spoon symbol)
  private iconMealSite: Style;
  // Purple = Mobile Markets (seasonal)
  private iconMobileMarket: Style;
  // Blue = Current location
  private iconBlue: Style;
  
  // Legacy icons for backward compatibility
  private iconMarket: Style;
  private iconPantry: Style;
  
  readonly resize: number = 0.65;
  readonly iconHeight: number = 98 * this.resize;
  readonly iconWidth: number = 90 * this.resize;
  readonly locationResize: number = 0.7;
  public mapInitialized: boolean = false;
  public currentMarkers: Feature[] = [];
  public currentLocation: Position;
  public popupContent: {
    title: string,
    class: string,
    id?: number,
    rating?: number
  } = {
    title: '',
    class: 'market'
  };

  // Search and filter state
  private currentSearchTerm: string = '';
  private filterEBT: boolean = false;
  private filterDUFB: boolean = false;
  private filterOpenNow: boolean = false;

  private container: HTMLElement;
  private content: HTMLElement;
  private closer: HTMLElement;

  constructor( 
    public marketService: MarketService,
    public eatsLocationsService: EatsLocationsService,
    public feedService: FeedService,
    public platform: Platform,
    private route: ActivatedRoute,
    public viewContainerRef: ViewContainerRef,
    private initService: InitService,
  ) { 
    // Current location icon (blue WiFi-style marker)
    this.iconBlue = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/wi-fi-2.png',
      }),
    });
    
    // Legacy icons for backward compatibility
    this.iconMarket = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/marker-supermarket.png',
      }),
    });
    
    this.iconPantry = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/marker-foodpantry.png',
      }),
    });
    
    // Color-coded icons per documentation requirements
    // Green for Farmers Markets - using a green circle marker
    this.iconFarmersMarket = new Style({
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: '#22c55e' }), // Green-500
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });
    
    // Blue for Grocery/Food Retailers
    this.iconGrocery = new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: '#3b82f6' }), // Blue-500
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });
    
    // Purple for Food Pantries
    this.iconFoodPantry = new Style({
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: '#a855f7' }), // Purple-500
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });
    
    // Purple for Meal Sites
    this.iconMealSite = new Style({
      image: new Circle({
        radius: 12,
        fill: new Fill({ color: '#9333ea' }), // Purple-600
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });
    
    // Purple for Mobile Markets
    this.iconMobileMarket = new Style({
      image: new Circle({
        radius: 11,
        fill: new Fill({ color: '#c084fc' }), // Purple-400
        stroke: new Stroke({ color: '#ffffff', width: 2 }),
      }),
    });
    
    this.initService.initializeServicesOnce();
    route.params.subscribe(val => {
      if(this.mapInitialized) {
        // Only do this if the map has already loaded
        Geolocation.getCurrentPosition().then(locationData => {
          if(this.isLocationOutsideGeneseeCounty(locationData)) {
            this.currentLocation = this.getFakeGeneseeCountyCoords();
          } else {
            this.currentLocation = locationData;
          }
          this.setMapZoom(this.currentLocation);
        });
      }
    });
  }

  ngAfterViewInit() {    
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({ 
        center: fromLonLat([ -83.694476, 43.016697 ]),
        zoom: 10,
        maxZoom: 18, 
      }),
    });
    
    this.markersLayer = new LayerVector({
      source: new SourceVector(),
      style: null
    });
    this.map.addLayer(this.markersLayer);
    this.currentLocationLayer = new LayerVector({
      source: new SourceVector(),
      style: null
    });
    this.map.addLayer(this.currentLocationLayer);

    /**
     * Elements that make up the popup.
     */
    this.container = document.getElementById('popup');
    this.content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');
    this.closer = closer;

    /**
     * Create an overlay to anchor the popup to the map.
     */
    const overlay = new Overlay({
      element: this.container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    this.overlayId = overlay.getId();
    this.map.addOverlay(overlay);

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    this.closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    this.map.on('singleclick', (evt) => this.handleClick(evt, this.eatsLocationsService, overlay));

    // Initialize the new data service
    this.eatsLocationsService.init();
    this.showAllEatsLocations();
  }

  /**
   * Get the appropriate icon style based on provider type
   * Implements color-coded icon logic from documentation:
   * - Green = Farmers Markets
   * - Blue = Grocery/Food Retailers
   * - Purple = Food Pantries, Meal Sites, Mobile Markets
   */
  private getIconForLocation(eatsLoc: EatsLocation): Style {
    // Use provider_type if available (from new data)
    if (eatsLoc.provider_type) {
      switch (eatsLoc.provider_type) {
        case 'FarmersMarket':
          return this.iconFarmersMarket;
        case 'FoodPantry':
          return this.iconFoodPantry;
        case 'MealSite':
          return this.iconMealSite;
        case 'MobileMarket':
          return this.iconMobileMarket;
        case 'FoodRetailer':
        default:
          return this.iconGrocery;
      }
    }
    
    // Fall back to legacy class-based logic
    if (eatsLoc.class?.includes('Pantry')) {
      return this.iconPantry;
    }
    return this.iconMarket;
  }

  handleClick(evt: MapBrowserEvent<any>, eatsService: EatsLocationsService, overlay: Overlay) {
    const lonLat = toLonLat(evt.coordinate);
    let result = eatsService.getNearby({
      coords: {
        latitude: lonLat[1],
        longitude: lonLat[0]
      }
    }, 1)[0];
    if (result) {
      this.popupContent = {
        title: result.eatsLocation.name,
        id: result.eatsLocation.id,
        rating: result.eatsLocation.reviewsRating,
        class: result.eatsLocation.class
      };
      overlay.setPosition(fromLonLat([result.eatsLocation.lng, result.eatsLocation.lat]));
    }
  }

  ionViewWillEnter() {
    this.searchBar.value = this.feedService.getSearchTerm();
  }

  showAllEatsLocations() {
    Geolocation.getCurrentPosition().then(locationData => {
      if(this.isLocationOutsideGeneseeCounty(locationData)) {
        this.currentLocation = this.getFakeGeneseeCountyCoords();
      } else {
        this.currentLocation = locationData;
      }
      this.addCurrentLocationMarker();

      if(this.eatsLocationsService.doneLoading()) {
        this.addMarkers(this.eatsLocationsService.eatsLocations);
        this.setMapZoom(this.currentLocation);
        this.mapInitialized = this.eatsLocationsService.doneLoading() && this.eatsLocationsService.eatsLocations.length > 0;
      } else {
        const myObserver = {
          next: x => { },
          error: err => console.error('Observer got an error: ' + err),
          complete: () => {
            this.addMarkers(this.eatsLocationsService.eatsLocations);
            this.setMapZoom(this.currentLocation);
            this.mapInitialized = this.eatsLocationsService.doneLoading() && this.eatsLocationsService.eatsLocations.length > 0;
          },
        };
        this.eatsLocationsService.notifier.subscribe(myObserver);
      }
    }).catch(err => {
      console.log(err);
      setTimeout(() => {
        this.showAllEatsLocations();
      }, 1000);
    });
  }
  
  addMarkers(eatsLocations: EatsLocation[]) {
    this.currentMarkers = [];
    eatsLocations.forEach( eatsLoc => {
      if(eatsLoc.lat && eatsLoc.lng) {
        let m = new Feature(new Point(fromLonLat([eatsLoc.lng, eatsLoc.lat])));
        
        // Use color-coded icon based on provider type
        m.setStyle(this.getIconForLocation(eatsLoc));
        
        // Store the eatsLocation data with the feature for click handling
        m.setProperties({
          eatsLocation: eatsLoc
        });
        
        this.currentMarkers.push(m);
      }
    });
    this.markersLayer.getSource().clear();
    this.markersLayer.getSource().addFeatures(this.currentMarkers);
  }
  
  addCurrentLocationMarker() {
    this.currentLocationLayer.getSource().clear();
    let m = new Feature(new Point(fromLonLat([this.currentLocation.coords.longitude, this.currentLocation.coords.latitude])));
    m.setStyle(this.iconBlue);
    this.currentLocationLayer.getSource().addFeature(m);
  }
  
  zoomToData(dataset: EatsLocation[], location: Position = this.currentLocation) {
    if (dataset.length === 0) return;
    
    let minLat = Math.min(...dataset.map(d => d.lat), location.coords.latitude);
    let maxLat = Math.max(...dataset.map(d => d.lat), location.coords.latitude);
    let minLng = Math.min(...dataset.map(d => d.lng), location.coords.longitude);
    let maxLng = Math.max(...dataset.map(d => d.lng), location.coords.longitude);
    
    // Center on the data
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    this.flyTo(fromLonLat([centerLng, centerLat]), 13, () => {});
  }
  
  setMapZoom(location: Position) {
    let nearby = this.eatsLocationsService.getNearby(location, 5).map(result => {
      return result.eatsLocation;
    });
    this.zoomToData(nearby, location);
  }
  
  isLocationOutsideGeneseeCounty(location: Position): boolean {
    let top: number = 43.253205;
    let left: number = -84.173757;
    let bottom: number = 42.779275;
    let right: number = -83.354729;

    return location.coords.latitude > top ||
      location.coords.latitude < bottom ||
      location.coords.longitude > right ||
      location.coords.longitude < left;
  }
  
  getFakeGeneseeCountyCoords(): Position {
    return {
      coords: {
        latitude: 43.031255,
        longitude: -83.705226,
        heading: 0,
        accuracy: 0.1,
        altitude: 229,
        altitudeAccuracy: 0.1,
        speed: 0
      },
      timestamp: Date.now()
    };
  }

  /**
   * Live-Filtering Search implementation
   * Searches inventory items (food categories) as per documentation
   */
  search(searchTerm: any) {
    const term = searchTerm?.toString() || '';
    this.currentSearchTerm = term;
    
    if(term) {
      // Use the new inventory-based search from eatsLocationsService
      const filteredLocations = this.eatsLocationsService.searchByInventory(term);
      
      // Apply additional program filters if active
      const finalResults = this.applyProgramFilters(filteredLocations);
      
      this.addMarkers(finalResults);
      if (finalResults.length > 0) {
        this.zoomToData(finalResults);
      }
    } else {
      this.currentSearchTerm = '';
      this.showAllEatsLocations();
    }
  }
  
  /**
   * Apply program filters (EBT, DUFB, Open Now)
   */
  applyProgramFilters(locations: EatsLocation[]): EatsLocation[] {
    return locations.filter(loc => {
      if (this.filterEBT && !loc.ebt_accepted) return false;
      if (this.filterDUFB && !loc.dufb_offered) return false;
      // TODO: Implement Open Now filter based on hours parsing
      // if (this.filterOpenNow && !this.isLocationOpenNow(loc)) return false;
      return true;
    });
  }
  
  /**
   * Toggle EBT/SNAP filter
   */
  toggleEBTFilter() {
    this.filterEBT = !this.filterEBT;
    this.refreshMarkers();
  }
  
  /**
   * Toggle DUFB (Double Up Food Bucks) filter
   */
  toggleDUFBFilter() {
    this.filterDUFB = !this.filterDUFB;
    this.refreshMarkers();
  }
  
  /**
   * Refresh markers based on current filters
   */
  refreshMarkers() {
    if (this.currentSearchTerm) {
      this.search(this.currentSearchTerm);
    } else {
      const allLocations = this.eatsLocationsService.eatsLocations;
      const filtered = this.applyProgramFilters(allLocations);
      this.addMarkers(filtered);
    }
  }

  ngAfterViewChecked() {
    // Set height of map so it is just below the search bar
    let height = this.searchBar.el.offsetHeight;
    // iOS fix for headers in notch
    if(this.platform.is("ios")) {
      height = this.searchBar.el.getBoundingClientRect().bottom;
    }
    this.mapContainer.nativeElement.style.setProperty('top', height + 'px')
  }

  flyTo(location, zoom, done: Function) {
    const duration = 2000;
    const view = this.map.getView();
    let parts = 2;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    view.animate(
      {
        center: location,
        duration: duration,
      },
      callback,
    );
    view.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback,
    );
  }
}
