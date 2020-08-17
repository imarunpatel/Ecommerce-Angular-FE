import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  isLoading = false;
  resetStatus: string = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onReset() {
    if(this.resetPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.isLoading);
    this.authService.resetPassword(this.resetPasswordForm.value).subscribe(
      (data) => {
        console.log("Reset Response", data);
        this.isLoading = false;
        this.resetStatus = "Check your email";
      },
      (error) => {
        console.log("error Response", error);
      }
      )
      // this.isLoading = false;
  }

}
