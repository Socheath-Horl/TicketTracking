import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user: Auth = this.authService.auth$.getValue();
    if (user != null) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(["/login"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  
}
