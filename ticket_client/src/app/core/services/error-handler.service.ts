import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService) { }

  errorHandler(error: HttpErrorResponse) {
    if(error) {
      switch(error.status) {
        case 200:
          console.log(error);
          this.messageService.add({severity:'error', summary: error.error.error.message, detail: error.message, life: 15000});
          break;
        case 400:
          break;
        case 401:
          this.messageService.add({severity:'error', summary: 'Unauthorize', detail: "You don't have authorize!", life: 15000});
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          console.log(error);
          if(error.error.Content) {
            this.messageService.add({severity:'error', summary: error.statusText, detail: error.error.Content.Message.replace(/,/gm, '\n'), life: 15000});
          } else {
            this.messageService.add({severity:'error', summary: error.statusText, detail: error.error.Message, life: 15000});
          }
          break;
        default:
          console.log(error);
          // this.messageService.add({severity:'error', summary: error.statusText, detail: error.message, life: 15000});
          break;
      }
    } else{
      throwError(error);
    }
  }
}
