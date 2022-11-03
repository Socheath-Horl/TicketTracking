import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Auth } from 'src/app/core/models/auth.model';
import { TicketTypeEnum } from 'src/app/core/models/ticket-type.enum';
import { Ticket } from 'src/app/core/models/ticket.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  constructor(
    private ticketService: TicketService,
    private modalService: ModalService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  bugTickets: Ticket[] = [];
  testCaseTickets: Ticket[] = [];
  featureRequestTickets: Ticket[] = [];
  resolvedTickets: Ticket[] = [];
  ticketItems: MenuItem[] = [];
  auth: Auth;

  ngOnInit(): void {
    this.auth = this.authService.auth$.getValue();
    this.ticketService.refreshTicker$.subscribe(refresh => {
      if (refresh) {
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
        command: () => this.onNewTicket(TicketTypeEnum.Bug),
        visible: this.authService.isPermitAction('bug_create', this.auth.Role)
      },
      {
        label: 'Test Case', 
        icon: 'pi pi-ticket', 
        command: () => this.onNewTicket(TicketTypeEnum.Test_Case),
        visible: this.authService.isPermitAction('test_case_create', this.auth.Role)
      },
      {
        label: 'Feature Request', 
        icon: 'pi pi-ticket', 
        command: () => this.onNewTicket(TicketTypeEnum.Feature_Request),
        visible: this.authService.isPermitAction('feature_request_create', this.auth.Role)
      },
    ];
  }

  classifyTicket(tickets: Ticket[]) {
    this.bugTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Bug);
    this.testCaseTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Test_Case);
    this.featureRequestTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Feature_Request);
    this.resolvedTickets = tickets.filter(t => t.TicketType === TicketTypeEnum.Resolved);
  }

  permitAction(action: string): boolean {
    let permit = this.authService.isPermitAction(action, this.auth.Role);
    return permit;
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
    console.log(ticket);
    // open dialog
    this.ticketService.setTicket(ticket);
    this.modalService.setDisplay(true);
  }

  onDeleteTicket(id: string, ticketType: TicketTypeEnum) {
    this.ticketService.deleteTicket(id, ticketType).subscribe(res => {
      this.toastService.addSingle("success", "Success", "Resolved");
      this.ticketService.setRefreshTicket(true);
      this.modalService.setDisplay(false);
    }, err => {
      this.toastService.addSingle("error", "", err.error.Message);
    });
  }
}
