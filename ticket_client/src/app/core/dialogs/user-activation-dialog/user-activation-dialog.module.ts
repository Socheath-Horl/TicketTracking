import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivationDialogComponent } from './user-activation-dialog.component';
import { AppCommonModule } from '../../../app-common.module';



@NgModule({
  declarations: [
    UserActivationDialogComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
  ],
  exports: [
    UserActivationDialogComponent
  ]
})
export class UserActivationDialogModule { }
