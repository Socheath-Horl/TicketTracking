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

  isPemitUrl(url: string, role: string) {
    let permit: boolean = false;
    if (role === 'Administrator') {
      permit = true; 
    } else {
      if (url === '/main/user') {
        permit = false;
      } else {
        permit = true;
      }
    }
    return permit;
  }

  isPermitAction(action: string, role: string) {
    let permit: boolean = false;
    if (role === 'Administrator') {
      permit = true;
    } else if (role === 'QA') {
      if (['bug_create', 'bug_update', 'bug_delete',
        'test_case_create', 'test_case_update', 'test_case_delete', 'test_case_resolved'].indexOf(action) !== -1) {
        permit = true;
      } else {
        permit = false;
      }
    } else if (role === 'RD') {
      if (['bug_resolved', 'feature_request_resolved'].indexOf(action) !== -1) {
        permit = true;
      } else {
        permit = false;
      }
    } else if (role == 'PM') {
      if (['feature_request_create', 'feture_request__update', 'feature_request_delete'].indexOf(action) !== -1) {
        permit = true;
      } else {
        permit = false;
      }
    }
    return permit;
  }
}
