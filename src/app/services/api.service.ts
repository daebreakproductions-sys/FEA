import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/models/user';
import { NewUser } from '@app/models/new-user';
import { HelperService } from './helper-service.service';
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
  public getUsers() {
    return this.apiTokenGet('api/users');
  }
  public getUser(id: number) {
    return this.apiTokenGet('api/users/'+id);
  }
  public createUser(postData: any) {
    return this.apiTokenPost('api/users', postData);
  }
  public updateUser(id: number, postData: any) {
    return this.apiTokenPatch('api/users/'+id, postData);
  }
  public deleteUser(id: number) {
    return this.apiTokenDelete('api/users/'+id);
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
