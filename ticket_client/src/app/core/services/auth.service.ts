import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from '../models/auth.model';
import { ErrorHandlerService } from './error-handler.service';
import { LocalCookieService } from './local-cookie.service';

const defaultAuth = null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private localCookieService: LocalCookieService,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) {
    let data = this.localCookieService.getItem(this.currentAuthCookie);
    if (data) {
      let auth: Auth = new Auth(data);
      this.auth$.next(auth);
    }
  }

  auth$ = new BehaviorSubject<Auth>(defaultAuth);
  currentAuthCookie: string = 'currentAuth';

  getAuth() {
    let data = this.localCookieService.getItem(this.currentAuthCookie);
    if(data) {
      return new Auth(data);
    }
    return new Auth({});
  }

  setAuth(user: Auth) {
    // TODO: change expire date
    let jwt = this.getDecodeToken(user.Token);
    console.log(moment(jwt.exp * 1000));
    this.localCookieService.setItem(this.currentAuthCookie, user, new Date(jwt.exp * 1000));
    this.auth$.next(user);
  }

  signin(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/Auth/login`, {
      username: username,
      password: password,
    }).pipe(map((result: Auth) => {
      this.setAuth(result);
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }))
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/Auth/logout`).pipe(map((result) => {
      this.localCookieService.removeItem(this.currentAuthCookie);
      this.auth$.next(defaultAuth);
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

  // Decode Token
  getDecodeToken(token) {
    console.log(token);
    let decodeToken = JSON.parse(atob(token.split('.')[1]));
    console.log(decodeToken);
    return decodeToken;
  }
}
