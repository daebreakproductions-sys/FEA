import { Injectable } from '@angular/core';
import { Deal } from '@app/models/deal';
import { APIListOptions } from '@app/models/list-options';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  readonly pageSize: number = 100;
  public doneLoading: boolean = false;
  public notifier: Subject<Deal[]> = new Subject<Deal[]>();

  constructor(
    public api: ApiService,
    public userService: UserService,
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
  async update(deal: any) {
    return new Promise<Deal>((resolve) => {
      this.api.updateDeal(deal).then(id => {
        this.api.getDeal(id).then(newDeal => {
          resolve(HelperService.PopulateDeal(newDeal));
        })
      });
    })
  }
  async byUser(id: number) {
    return new Promise<Deal[]>((resolve) => {
      this.api.getUserContent(id).then(ugcs => {
        let deals: Deal[];
        deals = ugcs.filter(ugc => {
          return ugc.class.endsWith('Deal');
        })
        .map(ugc => {
          let deal = <Deal>ugc;
          return HelperService.PopulateDeal(deal);
        });
        resolve(deals);
      });
    });
  }
  myDeals() {
    return new Promise<Deal[]>((resolve) => {
      this.userService.getMyContent("Deal").then(deals => {
        resolve(deals.map(ugc => {
          return HelperService.PopulateDeal(<Deal>ugc);
        }));
      });
    });
  }
  myFaveDeals() {
    return new Promise<Deal[]>((resolve) => {
      this.userService.getMyFaves("Deal").then(deals => {
        resolve(deals.map(ugc => {
          return HelperService.PopulateDeal(<Deal>ugc);
        }));
      });
    });
  }
}
