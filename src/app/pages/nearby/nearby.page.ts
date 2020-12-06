import { Component, OnInit } from '@angular/core';
import { Market } from '@app/models/market';
import { MarketService } from '@app/services/market.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-nearby',
  templateUrl: 'nearby.page.html',
  styleUrls: ['nearby.page.scss']
})
export class NearbyPage implements OnInit {
  private map: L.Map;
  private icon: L.Icon;
  readonly resize: number = 0.65;
  readonly iconHeight: number = 98 * this.resize;
  readonly iconWidth: number = 71 * this.resize;

  constructor( 
    public marketService: MarketService,
  ) { 
    this.icon = L.icon({
      iconUrl:      'assets/images/placeholder.svg',
      iconSize:     [this.iconWidth, this.iconHeight], // size of the icon
      iconAnchor:   [this.iconWidth * 0.5, this.iconHeight],
    });
  }

  addMarkers(markets: Market[]) {
    console.log(markets);
    markets.forEach( market => {
      if(market.lat && market.lng) {
        L.marker([market.lat, market.lng], {
          icon: this.icon
        }).addTo(this.map);

      }
    })
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

    if(this.marketService.doneLoading) {
      this.addMarkers(this.marketService.markets);
    } else {
      const myObserver = {
        next: x => { },
        error: err => console.error('Observer got an error: ' + err),
        complete: () => this.addMarkers(this.marketService.markets),
      };
      this.marketService.notifier.subscribe(myObserver);
    }
  }
}

  
