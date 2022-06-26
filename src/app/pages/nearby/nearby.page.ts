import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Market } from '@app/models/market';
import { MarketService } from '@app/services/market.service';
import * as L from 'leaflet';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar, Platform } from '@ionic/angular';
import { FeedService } from '@app/services/feed.service';
import { Deal } from '@app/models/deal';

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
  private icon: L.Icon;
  private iconBlue: L.Icon;
  readonly resize: number = 0.65;
  readonly iconHeight: number = 98 * this.resize;
  readonly iconWidth: number = 71 * this.resize;
  readonly locationResize: number = 0.7;
  private parser: DOMParser;
  public mapInitialized: boolean = false;
  public currentMarkers: L.Marker[] = [];
  public currentLocation: Position;

  constructor( 
    public marketService: MarketService,
    public router: Router,
    public feedService: FeedService,
    public platform: Platform,
    private route: ActivatedRoute,
  ) { 
    this.icon = L.icon({
      iconUrl:      'assets/images/placeholder.svg',
      iconSize:     [this.iconWidth, this.iconHeight], // size of the icon
      iconAnchor:   [this.iconWidth * 0.5, this.iconHeight],
      popupAnchor:  [0, this.iconHeight * -0.9],
    });
    this.iconBlue = L.icon({
      iconUrl:      'assets/images/placeholder_blue.svg',
      iconSize:     [this.iconWidth * this.locationResize, this.iconHeight * this.locationResize], // size of the icon
      iconAnchor:   [this.iconWidth * this.locationResize * 0.5, this.iconHeight * this.locationResize],
    });
    route.params.subscribe(val => {
      this.searchBar.value = this.feedService.getSearchTerm();
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

  showAllMarkets() {
    Geolocation.getCurrentPosition().then(locationData => {
      if(this.isLocationOutsideGeneseeCounty(locationData)) {
        this.currentLocation = this.getFakeGeneseeCountyCoords();
      } else {
        this.currentLocation = locationData;
      }
      L.marker([this.currentLocation.coords.latitude, this.currentLocation.coords.longitude], {
        icon: this.iconBlue
      }).addTo(this.map);

      if(this.marketService.doneLoading) {
        this.addMarkers(this.marketService.markets);
        this.setMapZoom(this.currentLocation);
        this.mapInitialized = this.marketService.doneLoading && this.marketService.markets.length > 0;
      } else {
        const myObserver = {
          next: x => { },
          error: err => console.error('Observer got an error: ' + err),
          complete: () => {
            this.addMarkers(this.marketService.markets);
            this.setMapZoom(this.currentLocation);
            this.mapInitialized = this.marketService.doneLoading && this.marketService.markets.length > 0;
          },
        };
        this.marketService.notifier.subscribe(myObserver);
      }
    }).catch(err => {
      console.log(err)
      setTimeout(() => {
        this.showAllMarkets();
      }, 1000);
    });
  }
  
  addMarkers(markets: Market[]) {
    markets.forEach( market => {
      if(market.lat && market.lng) {
        let m = L.marker([market.lat, market.lng], {
          icon: this.icon
        }).bindPopup(
          '<p><b>' + market.name + '</b></p><p><ion-label color="primary" id="lbl-market-' + market.id + '">Details</ion-label></p>'
        );
        this.currentMarkers.push(m);
        m.addTo(this.map);
      }
    })
  }
  zoomToData(dataset: Market[], location: Position = this.currentLocation) {
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
    let nearby = this.marketService.getNearby(location, 5).map(result => {
      return result.market;
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

  navigate(id: number) {
    this.router.navigate(['detail/market', id]);
  }

  search(searchTerm: any) {
    if(searchTerm) {
      this.feedService.setTypes(["deal"]);
      this.feedService.setSearchTerm(searchTerm).then(() => {
        this.currentMarkers.forEach(m => {
          this.map.removeLayer(m);
        });
        let ids = new Set<number>();
        this.feedService.results.forEach(ugc => {
          ids.add((<Deal>ugc).market.id);
        });
        let mkts = Array.from(ids).map(id => {
          return this.marketService.byIdFromCache(id);
        });
        this.addMarkers(mkts);
        this.zoomToData(mkts);
      });
    } else {
      this.feedService.reset();
      this.feedService.freshQuery();
      this.showAllMarkets();
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
    this.parser = new DOMParser;

    this.map.on('popupopen', (ev) => {
      let popup = this.parser.parseFromString(ev.sourceTarget._popup._content, "text/html");
      let lbl = popup.getElementsByTagName("ion-label")[0]
      let id = Number(lbl.id.split('-')[2]);
      const label = L.DomUtil.get('lbl-market-' + id);
      L.DomEvent.addListener(label, 'click', (ee) => {
        this.navigate(id);
      });
    });

    this.showAllMarkets();
  }
}

  
