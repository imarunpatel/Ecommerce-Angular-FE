import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { tap, map } from 'rxjs/operators';
import { Product } from './Product';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  addedProduct = [];
  public _cartLengthListener =  new Subject;

  // baseUrl = 'http://localhost:8000/api/v1/cart';
  // productUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) {
  }


  getCartItems(userId): Observable<any> {
    const api =  BACKEND_URL + `/v1/cart/userCart/${userId}`;
    return this.http.get(api);
  }

  addProductOnCart(product): Observable<any> {
    const userId = +localStorage.getItem('userId');
    const data = {user_id: userId, product_id: product };
    const api = BACKEND_URL + `/v1/cart/`;
    return this.http.post(api, data);
  }

  changeCartProductQty(data) {
    const api = BACKEND_URL + `/v1/cart/detail/${data.cartId}/`;
    const userId = +localStorage.getItem('userId');
    const newData = {qty: data.qty, user_id: userId, product_id: data.productId}
    return this.http.put(api, newData);
  };

  deleteCartItem(id): Observable<any> {
    const api = BACKEND_URL + `/v1/cart/detail/${id}/`;

    return this.http.delete(api);
  }

  _cartProducts = [];
  _addProductOnCart(id) {
    this._cartProducts.push(id);
  }

  public cartStatusListener = new Subject<Boolean>();

  _getCartItems() {
    this.cartStatusListener.next(true);
    return this._cartProducts;
  }

  _getProductById(id): Observable<any>{
      const api = BACKEND_URL + `/v1/product/` + id;
      return this.http.get<Product>(api);
  }
  
  
  _getCartLengthListener() {
      this._cartLengthListener.next(this._cartProducts.length);
  }

  

}
