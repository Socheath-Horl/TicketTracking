import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Auth } from '../models/auth.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: Auth;

    this.authService.auth$.pipe((take(1))).subscribe(user => currentUser = user);

    if(currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.Token}`
        }
      })
    }
    return next.handle(request);
  }
}
