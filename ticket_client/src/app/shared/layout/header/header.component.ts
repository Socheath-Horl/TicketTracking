import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Auth } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { RouteStateService } from '../../../core/services/route-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private routeStateService: RouteStateService,
    private authService: AuthService,
  ) { }

  menuItems: MenuItem[] = [];
  profileMenu: MenuItem[] = [];
  auth: Auth;

  ngOnInit(): void {
    this.auth = this.authService.getAuth();
    this.initMenu();
  }

  initMenu() {
    this.menuItems = [
      {
        label: "Ticket",
        icon: "pi pi-ticket",
        routerLink: "/main/ticket"
      },
      {
        label: "User",
        icon: "pi pi-users",
        routerLink: "/main/user"
      }
    ];

    this.profileMenu = [
      {
        label: this.auth.UserName,
        icon: "pi pi-user",
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => this.onLogout(),
      }
    ];
  }

  onLogout() {
    this.authService.logout().subscribe(res => {
      this.routeStateService.removeAll();
      this.routeStateService.add("Login", "/login", null, true);
    });
  }
}
