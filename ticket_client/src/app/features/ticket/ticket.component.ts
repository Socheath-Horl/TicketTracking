import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TicketTypeEnum } from 'src/app/core/models/ticket-type.enum';
import { Ticket } from 'src/app/core/models/ticket.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { TicketService } from 'src/app/core/services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  constructor(
    private ticketService: TicketService,
    private modalService: ModalService,
  ) { }

  bugTickets: Ticket[] = [];
  testCaseTickets: Ticket[] = [];
  featureRequestTickets: Ticket[] = [];
  resolvedTickets: Ticket[] = [];
  ticketItems: MenuItem[] = [];

  ngOnInit(): void {
    this.ticketService.refreshTicker$.subscribe(refresh => {
      if (refresh) {
        console.log('refresh', refresh);
        this.ticketService.getTickets().subscribe((res: Ticket[]) => this.classifyTicket(res));
      }
    });

    this.ticketService.getTickets().subscribe((res: Ticket[]) => {
      this.classifyTicket(res);
    });

    this.initTicketItems();
  }

  initTicketItems() {
    this.ticketItems = [
      {
        label: 'Bug', 
        icon: 'pi pi-ticket', 
        command: () => this.onNewTicket(TicketTypeEnum.Bug)
      },
      {
        label: 'Test Case', 
        icon: 'pi pi-ticket', 
        command: () => this.onNewTicket(TicketTypeEnum.Test_Case)
      },
      {
        label: 'Feature Request', 
        icon: 'pi pi-ticket', 
        command: () => this.onNewTicket(TicketTypeEnum.Feature_Request)
      },
    ];
  }

  classifyTicket(tickets: Ticket[]) {
    this.bugTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Bug);
    this.testCaseTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Test_Case);
    this.featureRequestTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Feature_Request);
    this.resolvedTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Resolved);
    console.log(this.bugTickets, this.testCaseTickets, this.featureRequestTickets, this.resolvedTickets)
  }

  onNewTicket(ticketType: TicketTypeEnum) {
    let ticket: Ticket = {
      Description: '',
      Id: '',
      Priority: false,
      Severity: false,
      Summary: '',
      TicketType: ticketType
    };
    
    // open dialog
    this.ticketService.setTicket(ticket);
    this.modalService.setDisplay(true);
  }

  onViewTicket(ticket: Ticket) {
    // open dialog
    this.ticketService.setTicket(ticket);
    this.modalService.setDisplay(true);
  }

  onDeleteTicket(id: string) {

  }
}
