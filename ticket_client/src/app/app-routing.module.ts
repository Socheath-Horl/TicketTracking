import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Auth_ROUTES } from './core/routes/auth.routes';
import { Full_ROUTES } from './core/routes/full-layout.routes';
import { ErrorComponent } from './shared/error/error.component';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: "main",
    component: LayoutComponent,
    children: Full_ROUTES,
  },
  {
    path: "error",
    component: ErrorComponent,
  },
  {
    path: "",
    children: Auth_ROUTES,
  },
  {
    path: "**",
    redirectTo: "error",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
