import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Role } from '../../models/role.model';
import { TicketTypeEnum } from '../../models/ticket-type.enum';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';
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

  ngOnDestroy(): void {
    this.displaySub.unsubscribe();
  }

  ngOnInit(): void {
    // for show or hide form dialog
    this.displaySub = this.modalService.display$.subscribe((display: boolean) => {
      this.display = display;
    });

    this.ticketService.editTicker$.subscribe((ticket: Ticket) => {
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

  onSave()  {
    this.loading = true;
    let ticket = this.ticketForm.value;
    let ticketType = ticket.resolved ? TicketTypeEnum.Resolved : ticket.ticketType;
    console.log(ticket);
    if (ticket.id) {
      this.ticketService.updateTicket(ticket.id, ticket.description, ticket.summary, ticket.serverity, ticket.priority, ticketType).subscribe(res => {
        this.toastService.addSingle("success", "Success", "Create Success");
        this.ticketService.setRefreshTicket(true);
        this.loading = false;
        this.modalService.setDisplay(false);
      }, err => {
        this.toastService.addSingle("error", "", err.error.Message);
        this.loading = false;
      });
    } else {
      this.ticketService.createTicket(ticket.description, ticket.summary, ticket.serverity, ticket.priority, ticketType).subscribe(res => {
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
