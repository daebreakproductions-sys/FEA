import { Injectable } from '@angular/core';
import { Deal } from '@app/models/deal';
import { APIListOptions } from '@app/models/list-options';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  public deals: Deal[];
  readonly pageSize: number = 100;
  public doneLoading: boolean = false;
  public notifier: Subject<Deal[]> = new Subject<Deal[]>();

  constructor(
    public api: ApiService,
  ) { 

  }

  init() {
    this.deals = [];
    let params: APIListOptions = {
      start: 0,
      length: this.pageSize,
      orderField: 'name',
      orderDir: 'ASC'
    };
    this.startPaging(params);
  }
  startPaging(params: APIListOptions) {
    this.api.getDeals(params).then(deals => {
      this.deals = this.deals.concat(deals);
      this.notifier.next(deals);
      if(deals.length == this.pageSize) {
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
    return this.deals.filter(deal => {
      return deal.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }
  byId(id: number) {
    return this.deals.filter(val => {
      return val.id == id;
    })[0];
  }
  async create(deal: any) {
    return new Promise<Deal>((resolve) => {
      this.api.createDeal(deal).then(id => {
        this.api.getDeal(id).then(newDeal => {
          this.deals.push(newDeal);
          resolve(newDeal);
        })
      });
    })
  }
}
