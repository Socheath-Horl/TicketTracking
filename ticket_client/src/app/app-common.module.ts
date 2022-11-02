import { NgModule } from '@angular/core';
import { AppPrimengModule } from './app-primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [],
  exports: [AppPrimengModule, FormsModule, ReactiveFormsModule],
  imports: []
})
export class AppCommonModule { }
