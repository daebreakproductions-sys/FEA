import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public url = environment.api_url;
  private accessToken = null;

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
          headers = {"Authorization": "Bearer "+ this.accessToken};
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
          headers = {"Authorization": "Bearer "+ this.accessToken};
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

  private apiTokenPatch(apiMethod, patchData, params = null){
    return new Promise((resolve, reject) => {
      let headers = null;
      this.auth.getAccessTokenPromise().then((data: any) => {
        this.accessToken = data;
        if (this.accessToken === null || this.accessToken === '') {
          throw new Error('Cannot make api call ' + apiMethod + '. No access.');
        } else {
          headers = {"Authorization": "Bearer "+ this.accessToken};
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
          headers = {"Authorization": "Bearer "+ this.accessToken};
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

  // auth
  public login(postData){
    return this.apiPublicPost('api/auth/login', postData);
  }
  public logout(){
    this.apiTokenGet('api/users/logout');
    //localStorage.clear();
    this.router.navigate(['login']);
  }

}
