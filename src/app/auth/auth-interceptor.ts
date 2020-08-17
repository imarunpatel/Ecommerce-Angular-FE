import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        
        let authRequest = req;
        const authToken = this.authService.getAccessToken();
        if (authToken != null) {

            // authRequest = req.clone({
            //     headers: req.headers.set('Authorization', 'Bearer ' + authToken)
            // });
            authRequest = this.addToken(req, authToken);
        }
        return next.handle(authRequest).pipe(catchError(error => {
            // if (authToken) {
                if (error instanceof HttpErrorResponse && error.status === 401 && authToken) {
                        return this.handle401Error(authRequest, next);
                } else {
                    return throwError(error);
                }
            // }
        }));
    }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private handle401Error(authRequest: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.authService.getNewAccessToken().pipe(
        switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.access);
            console.log('new token', token.access);
            console.log('token refreshed')
            return next.handle(this.addToken(authRequest, token.access));
        }));

    } else {
        return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(authToken => {
            return next.handle(this.addToken(authRequest, authToken));
        }));
    }
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
}