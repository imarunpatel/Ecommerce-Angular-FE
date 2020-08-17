import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// import { environment } form '../../environment'

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  private isAuthenticated = false;
  private userId: string;
  private userName: string;
  private tokenTimer: any;
  private intervalTime: any;
  private storedValue: number;
  public isLoading =  new Subject<any>();

  public getLoggedInName = new Subject<any>();
  private authStatusListener = new Subject<boolean>();
  public cartLengthListener =  new Subject<any>();


  // baseUrl = 'http://localhost:8000/api/token/';
  // userUrl = 'http://localhost:8000/api/v1/user';
  
  

  constructor(
    private http: HttpClient,
    private router: Router
  ) {   
     this.setAuthTimer();
  }

  getToken() {
    return this.token;
  }

  getAccessToken() {
    return localStorage.getItem('token');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  loginUser(username: string, password: string) {
    const api = BACKEND_URL + '/token/';
    const authData = { username, password };
    return this.http.post(api, authData).subscribe(
      (response: any) => {
        const token = response.access;
        const refreshToken = response.refresh;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.userId = response.id;
          this.authStatusListener.next(true);
          
          const expiresInDuration = response.expiresIn;
          this.saveAuthData(token, refreshToken, this.userId, expiresInDuration);
          // this.setAuthTimer();

          this.getUserProfile(response.id).subscribe(
            (data:any) => { 
              this.getLoggedInName.next(data.username);
              localStorage.setItem('userName', data.username);
            }
          );
          this.getCartLength(this.userId);
          this.isLoading.next(false);
          this.router.navigate(['/']);
        }
      }, 
      error => { 
        this.authStatusListener.next(false);
        this.isLoading.next(false);
      }   
    );
  }


  getCartLength(userId) {
    const api = BACKEND_URL + `/v1/cart/userCart/${userId}`;
    return this.http.get(api).subscribe(
      (data: any) => {
        this.cartLengthListener.next(data.length);
      }
    );
  }

  getUserProfile(id): Observable<any> {
    let api = BACKEND_URL + `/v1/user/${id}/`;
    return this.http.get(api).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    );
  }

  private setAuthTimer() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const expiresInDuration = +authInformation.expirationTime;
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

    const expiresIn = expirationDate.getTime() - now.getTime() - 3 * 1000;
    // console.log('expiresin', expiresIn, expiresInDuration);
    this.setIntervalTimer(expiresInDuration);
    
    this.tokenTimer = setTimeout(() => {
      clearInterval(this.intervalTime);
      this.getNewAccessToken().subscribe();
      localStorage.setItem('expiration', '60');
    }, expiresIn);
  }

  setIntervalTimer(initial : number): void {
    this.storedValue = initial || parseInt(localStorage.getItem('expiration'));
    this.intervalTime = setInterval(() => {
      this.storedValue -= 1;
      localStorage.setItem('expiration', this.storedValue.toString());
      // console.log(this.storedValue);
    }, 1000);
  }

  getNewAccessToken(): Observable<any> {
    const api = BACKEND_URL + '/token/refresh/';
    const refreshToken = localStorage.getItem('refresh');
    const data = { refresh: refreshToken };
    return this.http.post<any>(api, data)
    .pipe(map((user) => { 
      // console.log('token refreshed');
      localStorage.setItem('token', user.access);
      // this.setAuthTimer();
      // console.log(user.access);
      return user;
    }));
  }


  doLogout() {
    this.token=null;
    this.isAuthenticated = false;
    this.userId = null;
    this.clearAuthData();
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['/auth/login']);
    clearTimeout(this.tokenTimer);
    clearInterval(this.intervalTime);
  }

  


  //Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
      console.log('client side error');
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\n Message: ${error.message}`;
      console.log('server side error');
    }
    return throwError(msg);
  }

  signUp(formData) {
    let api = BACKEND_URL + '/v1/user/';
    return this.http.post(api, formData);
    
  }

  //Veryfying User status after page refresh
  verifyLoginStatus() {
    if (localStorage.getItem("userId")) {
      this.isAuthenticated = true;
      this.userName = localStorage.getItem('userName');
      this.userId = localStorage.getItem("userId");
      this.authStatusListener.next(this.isAuthenticated);
      this.getLoggedInName.next(this.userName);
    }
  }


  private saveAuthData(token:string, refreshToken: string, userId: string, expiresInDuration: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh', refreshToken);
    localStorage.setItem('userId', userId);
    // localStorage.setItem('expiration', expiresInDuration.toISOString());
    localStorage.setItem('expiration', expiresInDuration);
  }

  private clearAuthData() { 
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('refresh');
    localStorage.removeItem('expiration');
    localStorage.clear();
  }

  private getAuthData() { 
    const refreshToken = localStorage.getItem('refresh');
    const expirationTime = localStorage.getItem('expiration');
    if (!refreshToken || !expirationTime) {
      return;
    }
    return {
      refreshToken: refreshToken,
      expirationTime: expirationTime
    }
  }

  resetPassword(email) {
    const api = BACKEND_URL + '/password_reset/';
    return this.http.post(api, email);
  }

  confirmPassword(data): Observable<any> {
    console.log(data);
    const api = BACKEND_URL + '/password_reset/confirm/';
    return this.http.post(api, data);
  }
}
