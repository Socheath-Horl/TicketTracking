import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { AppCommonModule } from '../../app-common.module';
import { DialogsModule } from 'src/app/core/dialogs/dialogs.module';


@NgModule({
  declarations: [
    TicketComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    AppCommonModule,
    DialogsModule
  ]
})
export class TicketModule { }
