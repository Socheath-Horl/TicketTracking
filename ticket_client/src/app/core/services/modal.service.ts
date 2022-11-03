import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private display: boolean;
  display$ = new Subject<boolean>();

  constructor() { }

  setDisplay(display: boolean) {
    this.display = display;
    this.display$.next(this.display);
  }
}
