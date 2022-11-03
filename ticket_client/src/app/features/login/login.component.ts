import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../core/services/auth.service';
import { RouteStateService } from '../../core/services/route-state.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private routeStateService: RouteStateService,
  ) { }

  loginForm: FormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  // initialize from
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, RxwebValidators.email()]],
      password: ['', Validators.required],
    });
  }

  onGotoRegister() {
    this.router.navigateByUrl('/register');
  }

  onLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    let user = this.loginForm.value;
    this.authService.signin(user.email, user.password).subscribe(res => {
      this.routeStateService.add("Ticket", "/main/ticket", null, true);
      this.loading = false;
    }, err => {
      this.toastService.addSingle("error", "", err.error.Message);
      this.loading = false;
      return;
    });
  }
}
