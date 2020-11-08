import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: String = null;
  private authenticated: boolean = false;
  private redirectUrl: String = '';
  private cache_key = 'v1_';
  
  constructor () {
    this.getAccessTokenPromise();
  }

  public getAccessTokenPromise(){
    return new Promise((resolve) => {
      if (JSON.parse(localStorage.getItem('simplify_token'+this.cache_key)) !== null) {
        this.accessToken = JSON.parse(localStorage.getItem('simplify_token'+this.cache_key));
      }
      resolve(this.accessToken);
    });
  }

  public setRedirectUrl(value:String){
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
