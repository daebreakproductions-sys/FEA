import { Injectable } from '@angular/core';
import { User } from '@app/models/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public me: User;
  public followers: User[];
  public followees: User[];

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
    return this.followees.some(usr => {
      return usr.id == id;
    });
  }
  public getUser(id: number) {
    return this.apiService.getUser(id);
  }
}
