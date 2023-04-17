import { Injectable } from '@angular/core';
import { UGC } from '@app/models/ugc';
import { User } from '@app/models/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { HelperService } from './helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public me: User;
  public followers: User[];
  public followees: User[];
  public cache: User[] = [];

  constructor(
    public apiService: ApiService,
    public auth: AuthService,
  ) { }

  public init() {
    if(this.auth.isAuthenticated()) {
      this.loadFollowers();
      this.loadFollowees();
      this.loadMe();
    }
  }

  public async loadFollowers() {
    this.followers = await this.apiService.getMyFollowers();
  }

  public async loadFollowees() {
    this.followees = await this.apiService.getMyFollowees();
  }

  public async loadMe() {
    this.me = await this.apiService.getCurrentUser();
  }

  public getMyContent(filter: string = "") {
    return new Promise<UGC[]>((resolve) => {
      this.apiService.getMine().then(ugcs => {
        if(filter == "") {
          resolve(ugcs);
        } else {
          resolve(ugcs.filter(ugc => {
            return ugc.class.endsWith(filter);
          }))
        }
      });
    })
  }

  public getMyFaves(filter: string = "") {
    return new Promise<UGC[]>((resolve) => {
      this.apiService.getFaves().then(ugcs => {
        if(filter == "") {
          resolve(ugcs);
        } else {
          resolve(ugcs.filter(ugc => {
            return ugc.class.endsWith(filter);
          }))
        }
      });
    })
  }

  public toggleFollow(id: number) {
    this.apiService.toggleFollow(id);
    if(this.iFollow(id)) {
      // Un-following
      this.followees = this.followees.filter(x => {
        return x.id != id;
      })
    } else {
      // Following
      this.getUser(id).then(user => {
        this.followees.push(user);
      })
    }
  }

  public iFollow(id: number): boolean {
    return this.auth.isAuthenticated() && this.followees.some(usr => {
      return usr.id == id;
    });
  }

  public getUser(id: number) {
    let search = this.cache.filter(usr => {
      return usr.id == id;
    });
    return new Promise<User>((resolve) => {
      if(search.length > 0) {
        resolve(search[0]);
      } else {
        this.apiService.getUser(id).then(user => {
          let usr = HelperService.PopulateUser(user);
          if(!this.cache.some(userSearch => {
            return userSearch.id == usr.id;
          })) {
            this.cache.push(usr);
          }
          resolve(usr);
        });
      }
    });
  }

  public isMe(user: User): boolean {
    return this.auth.isAuthenticated() && this.me.id == user.id;
  }
}
