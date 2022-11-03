import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Auth } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermitGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user: Auth = this.authService.auth$.getValue();
    if(this.authService.isPemitUrl(state.url, user.Role)) {
      return true;
    } else {
      this.messageService.add({severity:'warn', summary: 'Warning', detail: "You don't have permission for this area!", life: 15000});
      this.router.navigateByUrl('/error');
      return false;
    }
  }
  
}
