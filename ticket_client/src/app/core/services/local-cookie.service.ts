import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalCookieService {
  constructor() { }
  /**
   * set localstorage storage item
   * @param key
   * @param value
   */
  setItem(key: string, value: any, expirationDate: Date) {
    let localCookie = {
      value: value,
      expireDate: expirationDate.getTime()
    };
    localStorage.setItem(key, JSON.stringify(localCookie));
  }

  /**
   * get localstorage storage item
   * @param key
   */
  getItem(key: string): any {
    let value = localStorage.getItem(key);
    if(value) {
      let now = new Date();
      let localCookie = JSON.parse(value);
      if(now.getTime() > localCookie.expireDate) {
        localStorage.removeItem(key);
        return null;
      } else {
        return localCookie.value;
      }
    } else {
      return null;
    }
  }

  /**
   * remove localstorage storage item
   * @param key
   */
  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * remove all localstorage storage items
   */
  clear() {
    localStorage.clear();
  }
}
