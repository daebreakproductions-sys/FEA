import { Component, OnInit } from '@angular/core';
import { Market } from '@app/models/market';
import { MarketService } from '@app/services/market.service';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx/index';
import { Geoposition } from '@ionic-native/geolocation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nearby',
  templateUrl: 'nearby.page.html',
  styleUrls: ['nearby.page.scss']
})
export class NearbyPage implements OnInit {
  private map: L.Map;
  private icon: L.Icon;
  private iconBlue: L.Icon;
  readonly resize: number = 0.65;
  readonly iconHeight: number = 98 * this.resize;
  readonly iconWidth: number = 71 * this.resize;
  readonly locationResize: number = 0.7;
  private parser: DOMParser;

  constructor( 
    public marketService: MarketService,
    public geolocation: Geolocation,
    public router: Router,
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
  }

  addMarkers(markets: Market[]) {
    markets.forEach( market => {
      if(market.lat && market.lng) {
        L.marker([market.lat, market.lng], {
          icon: this.icon
        }).bindPopup(
          '<p><b>' + market.name + '</b></p><p><ion-label color="primary" id="lbl-market-' + market.id + '">Details</ion-label></p>'
        ).addTo(this.map);
      }
    })
  }
  setMapZoom(location: Geoposition) {
    let nearby = this.marketService.getNearby(location.coords, 5).map(result => {
      return result.market;
    });
    let minLat = nearby.sort((a, b) => a.lat - b.lat)[0].lat;
    let maxLat = nearby.sort((a, b) => b.lat - a.lat)[0].lat;
    let minLng = nearby.sort((a, b) => a.lng - b.lng)[0].lng;
    let maxLng = nearby.sort((a, b) => b.lng - a.lng)[0].lng;

    this.map.flyToBounds([
      [minLat, minLng],
      [maxLat, maxLng]
    ]);
  }

  navigate(id: number) {
    this.router.navigate(['detail/market', id]);
  }

  ngOnInit(){
    this.map = L.map('map', {
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

    this.geolocation.getCurrentPosition().then(locationData => {
      L.marker([locationData.coords.latitude, locationData.coords.longitude], {
        icon: this.iconBlue
      }).addTo(this.map);

      if(this.marketService.doneLoading) {
        this.addMarkers(this.marketService.markets);
      } else {
        const myObserver = {
          next: x => { },
          error: err => console.error('Observer got an error: ' + err),
          complete: () => {
            this.addMarkers(this.marketService.markets);
            this.setMapZoom(locationData);
          },
        };
        this.marketService.notifier.subscribe(myObserver);
      }
    });

  }
}

  
