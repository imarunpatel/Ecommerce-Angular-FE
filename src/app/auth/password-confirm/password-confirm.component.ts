import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.css']
})
export class PasswordConfirmComponent implements OnInit {

  token: string;
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      password1: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    });
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
      })
    
  }

  ngOnInit(): void {
  }

  onReset(password = this.changePasswordForm.value) {
    const data = { password: password.password1, token: this.token };
    this.authService.confirmPassword(data).subscribe(
      data => {
        console.log(data);
      }
    )
  }

}
