import { AuthService } from '@app/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, UrlSegment} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class NonAuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()){
      this.router.navigate(['/home']);
      return false;
    }
    // is guest
    return true;
  }

}