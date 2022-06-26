import { Injectable } from '@angular/core';
import { Tip } from '@app/models/tip';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TipService {

  constructor(
    public api: ApiService,
    public userService: UserService,
  ) { }

  async byId(id: number) {
    return new Promise<Tip>((resolve) => {
      this.api.getTip(id).then(tip => {
        resolve(HelperService.PopulateTip(tip));
      });
    });
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
  async update(tip: any) {
    return new Promise<Tip>((resolve) => {
      this.api.updateTip(tip).then(id => {
        this.api.getTip(id).then(newTip => {
          resolve(HelperService.PopulateTip(newTip));
        })
      });
    })
  }
  async byUser(id: number, page: number = 0, pageLength: number = 10) {
    return new Promise<Tip[]>((resolve) => {
      this.api.getUserContent(id, page, pageLength).then(ugcs => {
        let tips: Tip[];
        tips = ugcs.filter(ugc => {
          return ugc.class.endsWith('Tip');
        })
        .map(ugc => {
          return <Tip>HelperService.PopulateEntity(ugc);
        });
        resolve(tips);
      });
    });
  }
  myTips() {
    return new Promise<Tip[]>((resolve) => {
      this.userService.getMyContent("Tip").then(tips => {
        resolve(tips.map(ugc => {
          return <Tip>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }
  myFaveTips() {
    return new Promise<Tip[]>((resolve) => {
      this.userService.getMyFaves("Tip").then(tips => {
        resolve(tips.map(ugc => {
          return <Tip>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }
}
