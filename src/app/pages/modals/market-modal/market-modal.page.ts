import { Component, OnInit } from '@angular/core';
import { Market } from '@app/models/market';
import { MarketService } from '@app/services/market.service';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx/index';

@Component({
  selector: 'app-market-modal',
  templateUrl: './market-modal.page.html',
  styleUrls: ['./market-modal.page.scss'],
})
export class MarketModalPage implements OnInit {
  public markets: Market[];
  private searchPromise: Promise<Market[]>;
  public searchResults: Market[];
  public nearby: Market[];

  constructor(
    public viewCtrl: ModalController,
    public marketService: MarketService,
    public geolocation: Geolocation,
  ) { 
    
  }

  ngOnInit() {
    const myObserver = {
      next: x => { },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => this.markets = this.marketService.markets,
    };
    if(this.marketService.doneLoading) {
      this.markets = this.marketService.markets;
    } else {
      this.marketService.notifier.subscribe(myObserver);
    }

    this.geolocation.getCurrentPosition().then(data => {
      this.nearby = this.marketService.getNearby(data.coords, 5).map(result => {
        return result.market;
      });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  search(searchTerm: any) {
    if(searchTerm.target.value) {
      this.searchResults = this.marketService.search(searchTerm.target.value);
    } else {
      this.searchResults = null;
    }
    // Search seems to be broken on the server
    // this.searchPromise = this.marketService.search(searchTerm.target.value);
    // this.searchPromise.then(results => {
    //   console.log(results);
    //   this.searchResults = results;
    // });
  }
}
