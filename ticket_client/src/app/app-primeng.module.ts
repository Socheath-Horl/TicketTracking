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
  ]
})
export class AppPrimengModule { }
