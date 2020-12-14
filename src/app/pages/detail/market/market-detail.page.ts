import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Market } from '@app/models/market';
import { MarketService } from '@app/services/market.service';
import { Geoposition } from '@ionic-native/geolocation';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-market',
  templateUrl: './market-detail.page.html',
  styleUrls: ['./market-detail.page.scss'],
})
export class MarketDetailPage implements OnInit {
  public market: Market;

  constructor(
    public marketService: MarketService,
    public route: ActivatedRoute,
    public platform: Platform,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    if(this.marketService.doneLoading) {
      this.market = this.marketService.byId(id);
    } else {
      this.marketService.notifier.subscribe({
        complete: () => this.market = this.marketService.byId(id)
      });
    }
  }

  navigate() {
    var mapUrl = '?q=' + this.market.lat + ',' + this.market.lng;
    // Check if a mobile device exists, or is web browser
    // if ( typeof(device) !== 'undefined') {
    var mapUrlFullPath = (this.platform.is("ios")) ? "maps://" + mapUrl : "geo:" + mapUrl;
    // } else {
    // var mapUrlType = "geo:" + mapUrl;
    // }
    window.open(mapUrlFullPath, '_system');
  }

}
