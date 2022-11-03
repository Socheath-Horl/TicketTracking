import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Role } from '../../models/role.model';
import { UserRole } from '../../models/user-role.model';
import { User } from '../../models/user.model';
import { ModalService } from '../../services/modal.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-activation-dialog',
  templateUrl: './user-activation-dialog.component.html',
  styleUrls: ['./user-activation-dialog.component.scss']
})
export class UserActivationDialogComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private toastService: ToastService,
  ) { }

  users: any[] = [];
  roles: any[] = [];
  display: boolean;
  displaySub: Subscription;
  userRoleForm: FormGroup;
  loading: boolean = false;

  ngOnDestroy(): void {
    this.displaySub.unsubscribe();
  }

  ngOnInit(): void {
    // for show or hide form dialog
    this.displaySub = this.modalService.display$.subscribe((display: boolean) => {
      this.display = display;
    });

    this.userService.getUsers().subscribe((res: User[]) => {
      this.users = res.map(r => {
        return {
          value: r.Email,
          label: r.Email,
        }
      });
    });
    this.userService.getRoles().subscribe((res: Role[]) => {
      this.roles = res.map(r => {
        return {
          value: r.Name,
          label: r.Name,
        }
      });
    });

    this.userService.editUser$.subscribe((user: User) => {
      this.initForm(user.Email);
    });
  }

  // initialize from
  initForm(user: string) {
    this.userRoleForm = this.fb.group({
      user: [user, Validators.required],
      role: ['', Validators.required],
    });
  }

  onActivate()  {
    this.loading = true;
    let userRole = this.userRoleForm.value;
    console.log(userRole);
    this.userService.activateUser(userRole.user, userRole.role).subscribe(res => {
      this.toastService.addSingle("success", "Success", "Activate Success");
      this.userService.setRefreshUser(true);
      this.loading = false;
      this.modalService.setDisplay(false);
    }, err => {
      this.toastService.addSingle("error", "", err.error.Message);
      this.loading = false;
    });
  }
}
