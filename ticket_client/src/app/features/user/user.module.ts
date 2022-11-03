import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { AppCommonModule } from '../../app-common.module';
import { DialogsModule } from '../../core/dialogs/dialogs.module';
import { UserActivationDialogModule } from 'src/app/core/dialogs/user-activation-dialog/user-activation-dialog.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AppCommonModule,
    DialogsModule,
  ]
})
export class UserModule { }
