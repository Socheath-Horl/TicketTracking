import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitGuard } from 'src/app/core/guards/permit.guard';
import { TicketComponent } from './ticket.component';

const routes: Routes = [
  {
    path: "",
    component: TicketComponent,
    canActivate: [PermitGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
