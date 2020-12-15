import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/models/user';
import { NewUser } from '@app/models/new-user';
import { HelperService } from './helper-service.service';
import { Market } from '@app/models/market';
import { APIListOptions } from '@app/models/list-options';
import { Tag } from '@app/models/tag';
import { Deal } from '@app/models/deal';
import { Tip } from '@app/models/tip';
import { UGC } from '@app/models/ugc';
import { Comment } from '@app/models/comment'
//import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public url = environment.api_url;
  private accessToken = null;
  private currentUser: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
  ) {
    
  }

  private apiPublicGet(apiMethod: string, params = null){
    return new Promise((resolve, reject) => {
      this.http.get(this.url+apiMethod,{
        params: params
      }).subscribe((data: any) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  private apiPublicPost(apiMethod: string, postData){
    return new Promise((resolve, reject) => {
      this.http.post(this.url+apiMethod, postData,{}).subscribe((data: any) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  private apiPublicPatch(apiMethod: string, postData){
    return new Promise((resolve, reject) => {
      this.http.patch(this.url+apiMethod, postData,{}).subscribe((data: any) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  private apiTokenGet(apiMethod, params = null){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Basic "+ this.accessToken};
          this.http.get(this.url+apiMethod,{
            headers: headers,
            params: params
          }).subscribe((data: any) => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  private apiTokenPost(apiMethod, postData, params = null){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Basic "+ this.accessToken};
          this.http.post(this.url+apiMethod, postData, {
            headers: headers,
            params: params
          }).subscribe((data: any) => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  private apiTokenPut(apiMethod, putData, params = null){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Basic "+ this.accessToken};
          this.http.put(this.url+apiMethod, putData, {
            headers: headers,
            params: params
          }).subscribe((data: any) => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  private apiTokenPatch(apiMethod, patchData, params = null){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Basic "+ this.accessToken};
          this.http.patch(this.url+apiMethod, patchData, {
            headers: headers,
            params: params
          }).subscribe((data: any) => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  private apiTokenDelete(apiMethod){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Basic "+ this.accessToken};
          this.http.delete(this.url+apiMethod, {
            headers: headers
          }).subscribe((data: any) => {
            resolve(data);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  // users
  public getUser(id: number) {
    return this.apiTokenGet('users/'+id) as Promise<User>;
  }
  public retrieveCurrentUser() {
    return this.apiTokenGet('users/me') as Promise<User>;
  };
  public newUser(user: NewUser) {
    return this.apiPublicPost('auth/create', user) as Promise<string>;
  }
  public uploadAvatar(file: string) {
    return this.apiTokenPut('users/me/avatar', file) as Promise<number>;
  }
  public updatePassword(pass: string) {
    return this.apiTokenPost('users/me/password', pass) as Promise<string>;
  }
  public setCurrentUser(user: User) {
    this.currentUser = user;
  }
  public async getCurrentUser(force: boolean = false): Promise<User> {
    return new Promise<User>((resolve, reject) =>  {
      if(force || (this.currentUser == null && this.auth.isAuthenticated())) {
        this.retrieveCurrentUser().then(user => {
          this.currentUser = HelperService.PopulateUser(user);
          resolve(this.currentUser);
        });
      } else {
        resolve(this.currentUser);
      }
    });
  }

  // Markets
  public getMarkets(params: APIListOptions) {
    return this.apiTokenGet('markets/list', params) as Promise<Market[]>;
  }
  public searchMarkets(searchTerm: string) {
    return this.apiTokenGet('markets/search', {q: searchTerm}) as Promise<Market[]>;
  }

  // Tags
  public getTags(params: APIListOptions) {
    return this.apiTokenGet('tags/list', params) as Promise<Tag[]>;
  }
  public createTag(tag: Tag) {
    return this.apiTokenPost('tags/create', tag) as Promise<bigint>;
  }
  public getTag(id: bigint) {
    return this.apiTokenGet('tags/' + id) as Promise<Tag>;
  }
  public addTag(tag: Tag, id: number) {
    return this.apiTokenPost('tags/add/' + id, tag.id) as Promise<number>;
  }
  public getTagsByEntity(entityId: number) {
    return this.apiTokenGet('tags/list/' + entityId) as Promise<Tag[]>;
  }

  // Deals
  public getDeals(params: APIListOptions) {
    return this.apiTokenGet('ugc/deals/list', params) as Promise<Deal[]>;
  }
  public createDeal(deal: Deal) {
    return this.apiTokenPost('ugc/deals/create', deal) as Promise<number>;
  }
  public getDeal(id: number) {
    return this.apiTokenGet('ugc/deals/' + id) as Promise<Deal>;
  }

  // Tips
  public getTips(params: APIListOptions) {
    return this.apiTokenGet('ugc/tips/list', params) as Promise<Tip[]>;
  }
  public createTip(tip: Tip) {
    return this.apiTokenPost('ugc/tips/create', tip) as Promise<number>;
  }
  public getTip(id: number) {
    return this.apiTokenGet('ugc/tips/' + id) as Promise<Tip>;
  }

  // Reaction/Likes
  public toggleLike(id: number) {
    return this.apiTokenPost('reactions/create', {target: id, value: 1}) as Promise<number>;
  }
  public getFaves() {
    return this.apiTokenGet('users/me/faves') as Promise<UGC[]>;
  }

  // Followers/Followees
  public toggleFollow(id: number) {
    return this.apiTokenPost('users/follow', id) as Promise<number>;
  }
  public getMyFollowers() {
    return this.apiTokenGet('users/me/followers') as Promise<User[]>;
  }
  public getUserFollowers(id: number) {
    return this.apiTokenGet('users/' + id + '/followers') as Promise<User[]>;
  }
  public getMyFollowees() {
    return this.apiTokenGet('users/me/followees') as Promise<User[]>;
  }
  public getUserFollowees(id: number) {
    return this.apiTokenGet('users/' + id + '/followees') as Promise<User[]>;
  }

  // UGC
  public getMine() {
    return this.apiTokenGet('users/me/mine') as Promise<UGC[]>;
  }
  public getUserContent(id: number) {
    return this.apiTokenGet('ugc/feed/' + id + '/false') as Promise<UGC[]>;
  }
  public getUserLikes(id: number) {
    return this.apiTokenGet('ugc/feed/' + id + '/true') as Promise<UGC[]>;
  }

  // Comments
  public getCommentsByEntity(entityId: number) {
    return this.apiTokenGet('ugc/comments/list/' + entityId) as Promise<Comment[]>;
  }
  public getComment(id: number) {
    return this.apiTokenGet('ugc/comments/' + id) as Promise<Comment>;
  }
  public createComment(comment: any) {
    return this.apiTokenPost('ugc/comments/create', comment) as Promise<number>;
  }

  // auth
  public login(username: string, password: string){
    let token = btoa(username + ':' + password);
    let headers = {"Authorization": "Basic "+ token};
    return new Promise<boolean>((resolve, reject) => {
      this.http.get(this.url+'users/me',{
        headers: headers
      }).subscribe((data: any) => {
        this.auth.setAccessToken(token);
        resolve(true);
      }, err => {
        this.auth.clearAccessToken();
        resolve(false);
      });
    });
//    return this.apiPublicGet('users/me', postData);
  }
  public logout(){
    this.apiTokenGet('api/users/logout');
    //localStorage.clear();
    this.router.navigate(['login']);
  }


}
