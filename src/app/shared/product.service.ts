import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Product} from './Product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    const api = BACKEND_URL + `/v1/product/`;
    return this.http.get<Product[]>(api);
  }

  getProduct(slugText): Observable<any> {
    const api = BACKEND_URL + `/v1/product/` + slugText;
    const data =  this.http.get<Product>(api);
    return data;
  }

  getProductById(id): Observable<any> {
    const api = BACKEND_URL + `/v1/product/` + id;
    return this.http.get<Product>(api);
  }
}
