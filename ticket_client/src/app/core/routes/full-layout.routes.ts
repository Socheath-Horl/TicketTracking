import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";

export const Full_ROUTES: Routes = [
  {
    path: "user",
    loadChildren: () =>
      import("../../features/user/user.module").then(
        (m) => m.UserModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ticket",
    loadChildren: () =>
      import("../../features/ticket/ticket.module").then((m) => m.TicketModule),
    canActivate: [AuthGuard],
  },
];
