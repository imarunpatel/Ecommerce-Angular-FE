import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  validationCheck = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      first_name: ['', [
        Validators.required
      ]],
      last_name: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]
    });
  }

  get f() { return this.signupForm.controls; }

  ngOnInit() {
  }

  onSignup() {
    this.validationCheck = true;
    if(this.signupForm.invalid) {
      return;
    }
    this.authService.signUp(this.signupForm.value).subscribe(
      (res) => {
        if (res) {
          this.signupForm.reset()
        }
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        console.log('from signup', error);
      }
    )
  }

}
