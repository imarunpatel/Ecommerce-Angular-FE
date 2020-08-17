import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
  } from "@angular/common/http";
  import { catchError } from "rxjs/operators";
  import { throwError } from "rxjs";
  import { Injectable } from "@angular/core";
  import { MatDialog } from "@angular/material/dialog";
  
  import { ErrorComponent } from "../error/error.component";
  import { ErrorService } from "../error/error.service";
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
  
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
  
    constructor(
      private dialog: MatDialog, 
      private errorService: ErrorService,
      private authService: AuthService,
      private router: Router
      ) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage;
          // if (error.error.code == 'token_not_valid') {
          //   this.authService.doLogout();
          // }
          // if (error.error.detail) {
          //   console.log(error);
          //   errorMessage = error.error.detail;
          // } 

          if (error.error.code !== 'token_not_valid') {
            errorMessage = error.error.detail;
            this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          }

          if (error.error.detail === 'No active account found with the given credentials') {
            this.authService.isLoading.next(false);
          }
          // this.authService.doLogout();
          
          return throwError(error);
        })
      );
    }


  }
  