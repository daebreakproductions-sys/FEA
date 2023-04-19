import { Injectable } from '@angular/core';
import { FoodPantrySite } from '@app/models/foodpantrysite';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FoodPantrySiteService {
  public foodpantrysites: FoodPantrySite[];
  readonly pageSize: number = 200;
  public doneLoading: boolean = false;
  public notifier: Subject<FoodPantrySite[]> = new Subject<FoodPantrySite[]>();

  constructor(
    public api: ApiService,
    public auth: AuthService,
  ) { 

  }

  init() {
    this.foodpantrysites = [];
    this.api.getAllFoodPantrySites().then(foodpantrysites => {
      this.foodpantrysites = foodpantrysites;
      this.notifier.next(foodpantrysites);
      this.doneLoading = true;
      this.notifier.complete();
    });
  }

  byId(id: number) {
    return this.foodpantrysites.filter(fps => {
      return fps.id == id;
    })[0];
  }
}
