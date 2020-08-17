import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Product} from './Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    const api = `${this.baseUrl}/product/`;
    return this.http.get<Product[]>(api);
  }

  getProduct(slugText): Observable<any> {
    const api = `${this.baseUrl}/product/` + slugText;
    const data =  this.http.get<Product>(api);
    return data;
  }

  getProductById(id): Observable<any> {
    const api = `${this.baseUrl}/product/` + id;
    return this.http.get<Product>(api);
  }
}
