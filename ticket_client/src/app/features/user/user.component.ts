import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserRole } from '../../core/models/user-role.model';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private modalService: ModalService,
  ) { }

  users: User[] = [];

  ngOnInit(): void {
    this.userService.refreshUser$.subscribe(refresh => {
      if (refresh) {
        console.log('refresh', refresh);
        this.userService.getUsers().subscribe((res: User[]) => this.users = res);
      }
    });

    this.userService.getUsers().subscribe((res: User[]) => this.users = res);
  }

  onShowActivate(user: User) {
    const userParams: UserRole = {
      user: user.Email,
      role: user.RoleNames[0],
    };

    // open dialog
    this.userService.setUser(user);
    this.modalService.setDisplay(true);
  }

}
