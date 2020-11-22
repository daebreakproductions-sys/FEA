import { Injectable } from '@angular/core';
import { User } from '@app/models/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: String = null;
  private authenticated: boolean = false;
  private redirectUrl: string = '/tabs/nearby';
  private cache_key = '_v1';
  private currentUser: User = null;
  
  constructor ( ) {
    this.getAccessTokenPromise();
  }

  public getAccessTokenPromise(){
    return new Promise((resolve) => {
      if (localStorage.getItem('basic_token'+this.cache_key) !== null) {
        this.accessToken = localStorage.getItem('basic_token'+this.cache_key);
      }
      resolve(this.accessToken);
    });
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('basic_token'+this.cache_key, token);
  }

  public clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('basic_token'+this.cache_key);
  }

  public setRedirectUrl(value:string){
    this.redirectUrl = value;
  }

  public getRedirectUrl(){
    return this.redirectUrl;
  }  

  public isAuthenticated(): boolean {
    if(this.accessToken === null){
      this.authenticated = false;
    } else {
      this.authenticated = true;
    }
    return this.authenticated;
  }

}
