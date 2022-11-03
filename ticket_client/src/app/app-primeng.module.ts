import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { FileUploadModule } from 'primeng/fileupload';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  exports: [
    MenubarModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    RatingModule,
    PaginatorModule,
    DropdownModule,
    AvatarModule,
    DynamicDialogModule,
    CalendarModule,
    TagModule,
    ChartModule,
    FileUploadModule,
    DataViewModule,
    ToastModule,
    MenuModule,
    PasswordModule,
    MessagesModule,
    DialogModule,
    SplitButtonModule,
    InputTextareaModule,
    InputSwitchModule
  ]
})
export class AppPrimengModule { }
