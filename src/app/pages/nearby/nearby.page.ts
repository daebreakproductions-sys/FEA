import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MarketService } from '@app/services/market.service';
import * as L from 'leaflet';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar, Platform } from '@ionic/angular';
import { FeedService } from '@app/services/feed.service';
import { Deal } from '@app/models/deal';
import { EatsLocation } from '@app/models/eats-location';
import { EatsLocationsService } from '@app/services/eats-locations.service';
import { HelperService } from '@app/services/helper-service.service';
import { MapPopupComponent } from '@app/components/map-popup/map-popup.component';
import 'leaflet.awesome-markers';
import 'leaflet.markercluster';

@Component({
  selector: 'app-nearby',
  templateUrl: 'nearby.page.html',
  styleUrls: ['nearby.page.scss']
})
export class NearbyPage implements OnInit {
  @ViewChild('mapDiv') mapDiv: ElementRef;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild(IonSearchbar) searchBar: any;
  private map: L.Map;
  private cluster: L.MarkerClusterGroup;
  private iconMarket: L.AwesomeMarkers.Icon;
  private iconBlue: L.AwesomeMarkers.Icon;
  private iconPantry: L.AwesomeMarkers.Icon;
  readonly resize: number = 0.65;
  readonly iconHeight: number = 98 * this.resize;
  readonly iconWidth: number = 90 * this.resize;
  readonly locationResize: number = 0.7;
  public mapInitialized: boolean = false;
  public currentMarkers: L.Marker[] = [];
  public currentLocation: Position;

  constructor( 
    public marketService: MarketService,
    public eatsLocationsService: EatsLocationsService,
    public feedService: FeedService,
    public platform: Platform,
    private route: ActivatedRoute,
    public viewContainerRef: ViewContainerRef,
  ) { 
    this.iconBlue = L.AwesomeMarkers.icon({
      icon: 'user',
      prefix: 'fa',
      markerColor: 'blue'
    });
    this.iconMarket = L.AwesomeMarkers.icon({
      icon: 'shopping-cart',
      prefix: 'fa',
      markerColor: 'green'
    });
    this.iconPantry = L.AwesomeMarkers.icon({
      icon: 'box-open',
      extraClasses: 'fa-solid',
      prefix: 'fa',
      markerColor: 'purple'
    });
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

  ionViewWillEnter() {
    this.searchBar.value = this.feedService.getSearchTerm();
  }

  showAllEatsLocations() {
    this.cluster.clearLayers();
    Geolocation.getCurrentPosition().then(locationData => {
      if(this.isLocationOutsideGeneseeCounty(locationData)) {
        this.currentLocation = this.getFakeGeneseeCountyCoords();
      } else {
        this.currentLocation = locationData;
      }
      this.addCurrentLocationMarker();

      if(this.eatsLocationsService.doneLoading) {
        this.addMarkers(this.eatsLocationsService.eatsLocations);
        this.setMapZoom(this.currentLocation);
        this.mapInitialized = this.eatsLocationsService.doneLoading && this.eatsLocationsService.eatsLocations.length > 0;
      } else {
        const myObserver = {
          next: x => { },
          error: err => console.error('Observer got an error: ' + err),
          complete: () => {
            this.addMarkers(this.eatsLocationsService.eatsLocations);
            this.setMapZoom(this.currentLocation);
            this.mapInitialized = this.eatsLocationsService.doneLoading && this.eatsLocationsService.eatsLocations.length > 0;
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

        let m = L.marker([eatsLoc.lat, eatsLoc.lng], {
          icon: HelperService.getClassType(eatsLoc) == "Market" ? this.iconMarket : this.iconPantry
        }).bindPopup(component.location.nativeElement);

        this.currentMarkers.push(m);
        this.cluster.addLayer(m);
      }
    })
  }
  addCurrentLocationMarker() {
    this.map.addLayer(
      L.marker([this.currentLocation.coords.latitude, this.currentLocation.coords.longitude], {
        icon: this.iconBlue
      })
    );
  }
  zoomToData(dataset: EatsLocation[], location: Position = this.currentLocation) {
    let minLat = Math.min(dataset.sort((a, b) => a.lat - b.lat)[0].lat, location.coords.latitude);
    let maxLat = Math.max(dataset.sort((a, b) => b.lat - a.lat)[0].lat, location.coords.latitude);
    let minLng = Math.min(dataset.sort((a, b) => a.lng - b.lng)[0].lng, location.coords.longitude);
    let maxLng = Math.max(dataset.sort((a, b) => b.lng - a.lng)[0].lng, location.coords.longitude);

    this.map.flyToBounds([
      [minLat, minLng],
      [maxLat, maxLng]
    ]);
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
          this.cluster.removeLayer(m);
        });
        let ids = new Set<number>();
        this.feedService.results.forEach(ugc => {
          ids.add((<Deal>ugc).market.id);
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

  ngOnInit(){
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
  ngAfterViewInit() {
    // let height = this.searchBar.nativeElement;
    this.map = L.map(this.mapDiv.nativeElement, {
      center: [ 43.016697, -83.694476 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      // disableClusteringAtZoom: 16
    });
    this.cluster.addTo(this.map);

    this.showAllEatsLocations();
  }
}

  
