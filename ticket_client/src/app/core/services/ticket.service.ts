import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { off } from 'process';
import { catchError, map, of, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketTypeEnum } from '../models/ticket-type.enum';
import { Ticket } from '../models/ticket.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(
    private errorHandlerService: ErrorHandlerService,
    private http: HttpClient,
  ) { }

  private editTicker: Ticket;
  editTicker$ = new Subject<Ticket>();
  private refreshTicket: boolean;
  refreshTicker$ = new Subject<boolean>();

  setRefreshTicket(refresh: boolean) {
    this.refreshTicket = refresh;
    this.refreshTicker$.next(this.refreshTicket);
  }

  getTickets() {
    return this.http.get(`${environment.apiUrl}/Tickets`).pipe(map((result: Ticket[]) => {
      return result;
    }),catchError(err => {
      this.errorHandlerService.errorHandler(err);
      return throwError(err);
    }));
  }

  setTicket(ticket: Ticket) {
    this.editTicker = ticket;
    this.editTicker$.next(this.editTicker);
  }

  createTicket(description: string, summary: string, severity: boolean, priority: boolean, ticketType: TicketTypeEnum) {
    let ticket = this.getTicketType(ticketType);
    if(ticket) {
      return this.http.post(`${environment.apiUrl}/${ticket}`, {
        Description: description,
        Summary: summary,
        Severity: severity,
        Priority: priority
      }).pipe(map((result) => {
        return result;
      }),catchError(err => {
        this.errorHandlerService.errorHandler(err);
        return throwError(err);
      }));
    } else {
      return throwError('Ticket Type invalid');
    }
  }

  updateTicket(id: string, description: string, summary: string, severity: boolean, priority: boolean, ticketType: TicketTypeEnum) {
    let ticket = this.getTicketType(ticketType);
    if(ticket) {
      return this.http.put(`${environment.apiUrl}/${ticket}/${id}`, {
        Description: description,
        Summary: summary,
        Severity: severity,
        Priority: priority
      }).pipe(map((result) => {
        return result;
      }),catchError(err => {
        this.errorHandlerService.errorHandler(err);
        return throwError(err);
      }));
    } else {
      return throwError('Ticket Type invalid');
    }
  }

  deleteTicket(id: string, ticketType: TicketTypeEnum) {
    let ticket = this.getTicketType(ticketType);
    if(ticket) {
      return this.http.delete(`${environment.apiUrl}/${ticket}/${id}`).pipe(map((result) => {
        return result;
      }),catchError(err => {
        this.errorHandlerService.errorHandler(err);
        return throwError(err);
      }));
    } else {
      return throwError('Ticket Type invalid');
    }
  }

  resolvedTicket(id: string, ticketType: TicketTypeEnum) {
    let ticket = this.getTicketType(ticketType);
    if(ticket) {
      return this.http.get(`${environment.apiUrl}/${ticket}/${id}/resolved`).pipe(map((result) => {
        return result;
      }),catchError(err => {
        this.errorHandlerService.errorHandler(err);
        return throwError(err);
      }));
    } else {
      return throwError('Ticket Type invalid');
    }
  }

  getTicketType(ticketType: TicketTypeEnum): string {
    let ticket = '';
    if (ticketType === TicketTypeEnum.Bug) {
      ticket = 'Bugs'
    } else if (ticketType === TicketTypeEnum.Feature_Request) {
      ticket = 'FeatureRequests'
    } else if (ticketType === TicketTypeEnum.Test_Case) {
      ticket = 'TestCases'
    }
    return ticket;
  }
}
