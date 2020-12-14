import { Injectable } from '@angular/core';
import { Deal } from '@app/models/deal';
import { APIListOptions } from '@app/models/list-options';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  readonly pageSize: number = 100;
  public doneLoading: boolean = false;
  public notifier: Subject<Deal[]> = new Subject<Deal[]>();

  constructor(
    public api: ApiService,
  ) { 

  }

  async byId(id: number) {
    return new Promise<Deal>((resolve) => {
      this.api.getDeal(id).then(deal => {
        resolve(HelperService.PopulateDeal(deal));
      });
    })
  }
  async create(deal: any) {
    return new Promise<Deal>((resolve) => {
      this.api.createDeal(deal).then(id => {
        this.api.getDeal(id).then(newDeal => {
          resolve(HelperService.PopulateDeal(newDeal));
        })
      });
    })
  }
}
