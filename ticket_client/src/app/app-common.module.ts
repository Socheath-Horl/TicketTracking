import { NgModule } from '@angular/core';
import { AppPrimengModule } from './app-primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

@NgModule({
  declarations: [],
  exports: [AppPrimengModule, FormsModule, ReactiveFormsModule, RxReactiveFormsModule],
  imports: []
})
export class AppCommonModule { }
