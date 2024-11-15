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
import { Fill, Icon, Style, Text } from 'ol/style';
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
  // private cluster: L.MarkerClusterGroup;
  private iconMarket: Style;
  private iconBlue: Style;
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
    // https://mapicons.mapsmarker.com/markers/restaurants-bars/wi-fi/?custom_color=223cd1
    this.iconBlue = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/wi-fi-2.png',
      }),
    });
    // https://mapicons.mapsmarker.com/markers/stores/general-merchandise/supermarket/?custom_color=20d44d
    this.iconMarket = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/marker-supermarket.png',
      }),
    });
    // https://mapicons.mapsmarker.com/markers/stores/food-drink/grocery/?custom_color=a522d4
    this.iconPantry = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/images/marker-foodpantry.png',
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
    // this.map.on('singleclick', function (evt) {
    //   console.log(evt)
    //   const coordinate = evt.coordinate;
    //   let lonLat = toLonLat(coordinate);
    //   const lon = lonLat[0];
    //   const lat = lonLat[1];
      
    //   const hdms = toStringHDMS(toLonLat(coordinate));
    
    //   content.innerHTML = '<p style="color: black">You clicked here:</p><code>' + hdms + '</code>';
    //   overlay.setPosition(coordinate);
    // });

    // tiles.addTo(this.map);

    // this.cluster = L.markerClusterGroup({
    //   showCoverageOnHover: false,
    //   // disableClusteringAtZoom: 16
    // });
    // this.cluster.addTo(this.map);

    this.showAllEatsLocations();
  }

  handleClick(evt: MapBrowserEvent<any>, eatsService: EatsLocationsService, overlay: Overlay) {
    const lonLat = toLonLat(evt.coordinate);
    let result = eatsService.getNearby({
      coords: {
        latitude: lonLat[1],
        longitude: lonLat[0]
      }
    }, 1)[0];
    this.popupContent = {
      title: result.eatsLocation.name,
      id: result.eatsLocation.id,
      rating: result.eatsLocation.reviewsRating,
      class: result.eatsLocation.class
    }
    overlay.setPosition(fromLonLat([result.eatsLocation.lng, result.eatsLocation.lat]));
  }

  ionViewWillEnter() {
    this.searchBar.value = this.feedService.getSearchTerm();
  }

  showAllEatsLocations() {
    // this.cluster.clearLayers();
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
      console.log(err)
      setTimeout(() => {
        this.showAllEatsLocations();
      }, 1000);
    });
  }
  
  addMarkers(eatsLocations: EatsLocation[]) {
    eatsLocations.forEach( eatsLoc => {
      if(eatsLoc.lat && eatsLoc.lng) {
        const component = this.viewContainerRef.createComponent(MapPopupComponent);
        component.instance.eatsLocation = eatsLoc;
        component.changeDetectorRef.detectChanges();

        let m = new Feature(new Point(fromLonLat([eatsLoc.lng, eatsLoc.lat])));
        m.setStyle(eatsLoc.class?.includes('Market') ? this.iconMarket : this.iconPantry);
        m.addEventListener('singleclick', (evt) => {

        })
        //.bindPopup(component.location.nativeElement);

        this.currentMarkers.push(m);
        // this.cluster.addLayer(m);
      }
    });
    this.markersLayer.getSource().clear();
    this.markersLayer.getSource().addFeatures(this.currentMarkers);
    
  }
  addCurrentLocationMarker() {
    let m = new Feature(new Point(fromLonLat([this.currentLocation.coords.longitude, this.currentLocation.coords.latitude])));
    m.setStyle(this.iconBlue);
    this.currentLocationLayer.getSource().addFeature(m);
  }
  zoomToData(dataset: EatsLocation[], location: Position = this.currentLocation) {
    let minLat = Math.min(dataset.sort((a, b) => a.lat - b.lat)[0].lat, location.coords.latitude);
    let maxLat = Math.max(dataset.sort((a, b) => b.lat - a.lat)[0].lat, location.coords.latitude);
    let minLng = Math.min(dataset.sort((a, b) => a.lng - b.lng)[0].lng, location.coords.longitude);
    let maxLng = Math.max(dataset.sort((a, b) => b.lng - a.lng)[0].lng, location.coords.longitude);
    // TODO: Calculate bounds/zoom from data set

    this.flyTo(fromLonLat([location.coords.longitude, location.coords.latitude]), 13, () => {});
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

  search(searchTerm: any) {
    if(searchTerm) {
      this.feedService.setTypes(["deal"]);
      this.feedService.setSearchTerm(searchTerm).then(() => {
        this.currentMarkers.forEach(m => {
          // this.cluster.removeLayer(m);
        });
        let ids = new Set<number>();
        this.feedService.results.forEach(ugc => {
          if(ugc.deal) {
            ids.add(ugc.deal.market.id);
          }
        });
        let mkts = Array.from(ids).map(id => {
          return this.marketService.byIdFromCache(id);
        })
        .filter(mkt => {
          return mkt.lat != 0 && mkt.lng !=0;
        });
        this.addMarkers(mkts);
        this.zoomToData(mkts);
      });
    } else {
      this.feedService.reset();
      this.feedService.freshQuery();
      this.showAllEatsLocations();
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

  
