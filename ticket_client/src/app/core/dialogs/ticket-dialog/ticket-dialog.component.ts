import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Auth } from '../../models/auth.model';
import { Role } from '../../models/role.model';
import { TicketTypeEnum } from '../../models/ticket-type.enum';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { TicketService } from '../../services/ticket.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.scss']
})
export class TicketDialogComponent implements OnInit {
  constructor(
    private ticketService: TicketService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  users: any[] = [];
  tickets: any[] = [
    { label: 'Bug', value: TicketTypeEnum.Bug },
    { label: 'Test Case', value: TicketTypeEnum.Test_Case },
    { label: 'Feature Request', value: TicketTypeEnum.Feature_Request },
  ];
  display: boolean;
  displaySub: Subscription;
  ticketForm: FormGroup;
  loading: boolean = false;
  auth: Auth;
  ticket: Ticket;

  ngOnDestroy(): void {
    this.displaySub.unsubscribe();
  }

  ngOnInit(): void {
    this.auth = this.authService.auth$.getValue();
    // for show or hide form dialog
    this.displaySub = this.modalService.display$.subscribe((display: boolean) => {
      this.display = display;
    });

    this.ticketService.editTicker$.subscribe((ticket: Ticket) => {
      this.ticket = ticket;
      this.initForm(ticket);
    });
  }

  // initialize from
  initForm(ticket: Ticket) {
    this.ticketForm = this.fb.group({
      id: [ticket.Id],
      summary: [ticket.Summary, Validators.required],
      description: [ticket.Description, Validators.required],
      severity: [ticket.Severity],
      priority: [ticket.Priority],
      resolved: [ticket.TicketType === TicketTypeEnum.Resolved],
      ticketType: [ticket.TicketType, Validators.required]
    });
  }

  permitAction(action: string): boolean {
    let ticket = '';
    if (this.ticket.TicketType === TicketTypeEnum.Bug) {
      ticket = 'bug';
    } else if (this.ticket.TicketType === TicketTypeEnum.Test_Case) {
      ticket = 'test_case';
    } else if (this.ticket.TicketType === TicketTypeEnum.Feature_Request) {
      ticket = 'feature_request';
    }
    let permit = this.authService.isPermitAction(`${ticket}_${action}`, this.auth.Role);
    return permit;
  }

  onSave()  {
    this.ticketForm.markAllAsTouched();
    if (this.ticketForm.invalid) {
      return;
    }
    
    this.loading = true;
    let ticket = this.ticketForm.value;
    console.log(ticket);
    let ticketType = ticket.resolved ? TicketTypeEnum.Resolved : ticket.ticketType;

    if (ticket.id) {
      if (ticket.resolved) {
        this.ticketService.resolvedTicket(ticket.id, ticket.ticketType).subscribe(res => {
          this.toastService.addSingle("success", "Success", "Resolved");
          this.ticketService.setRefreshTicket(true);
          this.loading = false;
          this.modalService.setDisplay(false);
        }, err => {
          this.toastService.addSingle("error", "", err.error.Message);
          this.loading = false;
        });
      } else {
        this.ticketService.updateTicket(ticket.id, ticket.description, ticket.summary, ticket.severity, ticket.priority, ticketType).subscribe(res => {
          this.toastService.addSingle("success", "Success", "Create Success");
          this.ticketService.setRefreshTicket(true);
          this.loading = false;
          this.modalService.setDisplay(false);
        }, err => {
          this.toastService.addSingle("error", "", err.error.Message);
          this.loading = false;
        });
      }
    } else {
      this.ticketService.createTicket(ticket.description, ticket.summary, ticket.severity, ticket.priority, ticketType).subscribe(res => {
        this.toastService.addSingle("success", "Success", "Update Success");
        this.ticketService.setRefreshTicket(true);
        this.loading = false;
        this.modalService.setDisplay(false);
      }, err => {
        this.toastService.addSingle("error", "", err.error.Message);
        this.loading = false;
      });
    }
  }
}
