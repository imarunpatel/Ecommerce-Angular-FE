import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { tap, map } from 'rxjs/operators';
import { Product } from './Product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  addedProduct = [];
  public _cartLengthListener =  new Subject;

  baseUrl = 'http://localhost:8000/api/v1/cart';
  productUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) {
  }


  getCartItems(userId): Observable<any> {
    const api = `${this.baseUrl}/userCart/${userId}`;
    return this.http.get(api);
  }

  addProductOnCart(product): Observable<any> {
    const userId = +localStorage.getItem('userId');
    const data = {user_id: userId, product_id: product };
    const api = `${this.baseUrl}/`;
    return this.http.post(api, data);
  }

  changeCartProductQty(data) {
    const api = `${this.baseUrl}/detail/${data.cartId}/`;
    const userId = +localStorage.getItem('userId');
    const newData = {qty: data.qty, user_id: userId, product_id: data.productId}
    return this.http.put(api, newData);
  };

  _cartProducts = [];
  _addProductOnCart(id) {
    this._cartProducts.push(id);
    console.log(this._cartProducts);
  }

  public cartStatusListener = new Subject<Boolean>();

  _getCartItems() {
    this.cartStatusListener.next(true);
    return this._cartProducts;
  }

  _getProductById(id): Observable<any>{
      const api = `${this.productUrl}/product/` + id;
      return this.http.get<Product>(api);
  }
  
  
  _getCartLengthListener() {
    console.log('listener clicked')
      this._cartLengthListener.next(this._cartProducts.length);
      console.log('after listener')
  }

}
