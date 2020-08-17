import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  validationCheck = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  ngOnInit(): void {
    this.authService.isLoading.subscribe(
      (data) => {
        this.isLoading = data;
      }
    )
  }

  get f() { return this.loginForm.controls; }

  onLogin() {
    this.validationCheck = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(this.loginForm.value.username, this.loginForm.value.password);
    // this.isLoading = false;
  }

    

}
