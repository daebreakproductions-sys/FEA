import { Injectable } from '@angular/core';
import { APIListOptions } from '@app/models/list-options';
import { Market } from '@app/models/market';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Position } from '@capacitor/geolocation';
import { HelperService } from './helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  public markets: Market[];
  readonly pageSize: number = 200;
  public doneLoading: boolean = false;
  public notifier: Subject<Market[]> = new Subject<Market[]>();

  constructor(
    public api: ApiService,
    public auth: AuthService,
  ) { 

  }

  init() {
    this.markets = [];
    if(this.auth.isAuthenticated()) {
      this.api.getAllMarkets().then(markets => {
        this.markets = markets;
        this.notifier.next(markets);
        this.doneLoading = true;
        this.notifier.complete();
      });
    }
  }

  private params: APIListOptions = {
    start: 0,
    length: this.pageSize,
    orderField: 'name',
    orderDir: 'ASC'
  };
  startPaging(params: APIListOptions) {
    this.api.getMarkets(params).then(markets => {
      this.markets = this.markets.concat(markets);
      this.notifier.next(markets);
      if(markets.length == this.pageSize) {
        let newParams = params;
        newParams.start += this.pageSize;
        this.startPaging(newParams);
      } else {
        this.doneLoading = true;
        this.notifier.complete();
      }
    });
  }

  search(searchTerm: string) {
    return this.markets.filter(mkt => {
      return mkt.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }

  getNearby(location: Position, numberOfResults: number): { distance: number, market: Market } [] {
    let distances = this.markets.map(mkt => {
      return { distance: this.distance(mkt.lat, mkt.lng, location.coords.latitude, location.coords.longitude), market: mkt };
    });

    return distances.sort((a,b) => {
      return (a.distance > b.distance) ? 1 : -1;
    }).slice(0, numberOfResults);
  }

  distance(lat1:number, lon1:number, lat2:number, lon2:number, unit:string = "M"): number {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  byId(id: bigint) {
    return new Promise<Market>((resolve) => {
      this.api.getMarket(id).then(mkt => {
        resolve(HelperService.PopulateMarket(mkt));
      });
    });
  }
  byIdFromCache(id: number) {
    return this.markets.filter(mkt => {
      return mkt.id == id;
    })[0];
  }
}
