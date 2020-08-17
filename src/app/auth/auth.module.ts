import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordConfirmComponent } from './password-confirm/password-confirm.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetPasswordComponent, PasswordConfirmComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule {}
