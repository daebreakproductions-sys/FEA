import { Injectable } from '@angular/core';
import { EatsLocation } from '@app/models/eats-location';
import { Position } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { FoodPantrySiteService } from './foodpantrysite.service';
import { HelperService } from './helper-service.service';
import { MarketService } from './market.service';

@Injectable({
  providedIn: 'root'
})
export class EatsLocationsService {
  public eatsLocations: EatsLocation[];
  readonly pageSize: number = 200;
  public notifier: Subject<EatsLocation[]> = new Subject<EatsLocation[]>();

  constructor(
    public marketService: MarketService,
    public foodPantrySiteService: FoodPantrySiteService,
    public helpers: HelperService,
  ) { }

  init() {
    this.eatsLocations = [];
    const myObserver = {
      next: x => {
        this.eatsLocations = this.eatsLocations.concat(x);
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => { },
    };
    this.marketService.notifier.subscribe(myObserver);
    this.marketService.init();
    this.foodPantrySiteService.notifier.subscribe(myObserver);
    this.foodPantrySiteService.init();
  }
  doneLoading(): boolean {
    return this.marketService.doneLoading && this.foodPantrySiteService.doneLoading;
  }
  getNearby(location: Position, numberOfResults: number): { distance: number, eatsLocation: EatsLocation } [] {
    let distances = this.eatsLocations
    .filter(l => {
      return l.lat && l.lng;
    })
    .map(eatsLoc => {
      return { distance: this.helpers.distance(eatsLoc.lat, eatsLoc.lng, location.coords.latitude, location.coords.longitude), eatsLocation: eatsLoc };
    });

    return distances.sort((a,b) => {
      return (a.distance > b.distance) ? 1 : -1;
    }).slice(0, numberOfResults);
  }

}
