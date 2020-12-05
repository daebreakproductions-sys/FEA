import { Injectable } from '@angular/core';
import { Tip } from '@app/models/tip';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TipService {

  constructor(
    public api: ApiService,
  ) { }

  async byId(id: number) {
    return await this.api.getTip(id);
  }
  async create(tip: any) {
    return new Promise<Tip>((resolve) => {
      this.api.createTip(tip).then(id => {
        this.api.getTip(id).then(newTip => {
          resolve(newTip);
        })
      });
    })
  }

}
