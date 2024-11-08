import { AuthService } from '@app/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AlertAuthGuard  {


  constructor(
    private auth: AuthService,
  ) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()){
      return true;
    }

    this.auth.launchLoginAlert(state.url);

    return false;
  }
}