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
    public helpers: HelperService,
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
      return { distance: this.helpers.distance(mkt.lat, mkt.lng, location.coords.latitude, location.coords.longitude), market: mkt };
    });

    return distances.sort((a,b) => {
      return (a.distance > b.distance) ? 1 : -1;
    }).slice(0, numberOfResults);
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
