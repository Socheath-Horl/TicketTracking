import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitGuard } from 'src/app/core/guards/permit.guard';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    canActivate: [PermitGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
