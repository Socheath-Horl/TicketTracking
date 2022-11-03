import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Message, MessageService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
  ) { }

  registerForm: FormGroup;
  loading: boolean = false;
  success: boolean = false;

  ngOnInit(): void {
    // this.message.push({severity:'success', summary:'', detail:'Register success! Please contact System Administrator to activate your account!'});
    this.initForm();
  }

  // initialize from
  initForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, RxwebValidators.email()]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, RxwebValidators.compare({fieldName:'password' })]],
    });
  }

  onGotoLogin() {
    this.router.navigateByUrl('/login');
  }

  onRegister() {
    this.loading = true;
    let user = this.registerForm.value;
    this.userService.register(user.email, user.password, user.confirmPassword).subscribe(res => {
      this.toastService.addSingle("success", "Success", "Register Success");
      this.loading = false;
      this.success = true;
    }, err => {
      this.toastService.addSingle("error", "", err.error.Message);
      this.loading = false;
      return;
    })
  }
}
