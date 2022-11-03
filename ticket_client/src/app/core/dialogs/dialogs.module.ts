import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../app-common.module';
import { UserActivationDialogModule } from './user-activation-dialog/user-activation-dialog.module';
import { TicketDialogModule } from './ticket-dialog/ticket-dialog.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCommonModule,
    UserActivationDialogModule,
    TicketDialogModule
  ],
  exports: [
    UserActivationDialogModule,
    TicketDialogModule
  ]
})
export class DialogsModule { }
