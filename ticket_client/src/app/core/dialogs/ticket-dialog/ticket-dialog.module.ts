import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDialogComponent } from './ticket-dialog.component';
import { AppCommonModule } from '../../../app-common.module';



@NgModule({
  declarations: [
    TicketDialogComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
  ],
  exports: [
    TicketDialogComponent
  ]
})
export class TicketDialogModule { }
