import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from '../models/auth.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
  ) { }

  private editUser: User;
  editUser$ = new Subject<User>();
  private refreshUser: boolean;
  refreshUser$ = new Subject<boolean>();

  setRefreshUser(refresh: boolean) {
    this.refreshUser = refresh;
    this.refreshUser$.next(this.refreshUser);
  }

  getUsers() {
    return this.http.get(`${environment.apiUrl}/Auth/users`).pipe(map((result: User[]) => {
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

  setUser(user: User) {
    this.editUser = user;
    this.editUser$.next(this.editUser);
  }

  getRoles() {
    return this.http.get(`${environment.apiUrl}/Auth/roles`).pipe(map((result: Role[]) => {
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

  register(email, password, confirmPassword) {
    return this.http.post(`${environment.apiUrl}/Auth/register`, {
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword
    }).pipe(map((result: Auth) => {
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

  activateUser(email, role) {
    return this.http.post(`${environment.apiUrl}/Auth/activate`, {
      UserName: email,
      RoleName: role,
    }).pipe(map((result: Auth) => {
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

}
