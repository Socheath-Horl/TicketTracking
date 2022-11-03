import { Routes } from "@angular/router";

export const Auth_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("../../features/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "register",
    loadChildren: () =>
      import("../../features/register/register.module").then(
        (m) => m.RegisterModule
      ),
  },
];
