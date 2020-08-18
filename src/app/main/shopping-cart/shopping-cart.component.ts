import { Component, OnInit, OnDestroy } from '@angular/core';
import {ShoppingCartService} from '../../shared/shopping-cart.service';
import {AuthService} from '../../auth/auth.service';
import {ProductService} from '../../shared/product.service';
import { Subscription } from 'rxjs';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{

  faStar = faStar;
  userId: number;
  productIds: [];
  cartProducts = [];
  cartStatus: string;
  isCartEmpty: boolean;
  isLoading = false;
  shoppingCartSub: Subscription;
  mainUrl = environment.mainUrl;



  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private productService: ProductService
  ) {
    this.userId = +localStorage.getItem('userId');
    console.log('userId', this.userId);
  }

  ngOnInit(): void {
    if (this.authService.getIsAuth()) {
      // Getting product ids associated with the loggedin user
      this.shoppingCartService.getCartItems(this.userId).subscribe(
        (data: any) => {
              this.productIds = data;
              this.getProducts(this.productIds);
              this.isCartEmpty = false;
          }
          );
        } else {
          this._getProducts();
        }
  };

  _getProducts() {
    this.shoppingCartService._cartProducts.forEach(element => {
      this.shoppingCartService._getProductById(element).subscribe(
        (data: any) => {
          const newData = {item: data, qty: 0, cartId: 0}
          this.cartProducts.push(newData);
        }
      )
    });
  }

  getProducts(productIds) {
    for(const ids in productIds) {
      this.productService.getProductById(productIds[ids].product_id).subscribe(
        (data: any) => {
          const newData = {item: data, qty: productIds[ids].qty, cartId: productIds[ids].id}
          this.cartProducts.push(newData);
        }
      );
    };
  };

  onPlus(localId, cartId, qty, productId) {
    if(this.authService.getIsAuth()) {
      qty = qty + 1;
      const data = {cartId, qty, productId};
      this.shoppingCartService.changeCartProductQty(data).subscribe(
        (data: any) => {
          for(let i=0; i<this.cartProducts.length; i++) {
            if(this.cartProducts[i].item.id == productId) {
              this.cartProducts[i].qty = this.cartProducts[i].qty + 1;
            };
          };
        }
      );
    } else {
      for(let i=0; i<this.cartProducts.length; i++) {
        if(this.cartProducts[i].item.id == productId) {
          this.cartProducts[i].qty = this.cartProducts[i].qty + 1;
        };
      }
    }
  };

  onMinus(cartId, qty, productId) {
    if(this.authService.getIsAuth()) {
      qty = qty - 1;
      const data = {cartId, qty, productId};
      this.shoppingCartService.changeCartProductQty(data).subscribe(
        (data) => {
          for(let i=0; i<this.cartProducts.length; i++) {
            if(this.cartProducts[i].item.id == productId) {
              this.cartProducts[i].qty = this.cartProducts[i].qty - 1;
            };
          };
        }
      );
    } else {
        for(let i=0; i<this.cartProducts.length; i++) {
          if(this.cartProducts[i].item.id == productId) {
            this.cartProducts[i].qty = this.cartProducts[i].qty - 1;
          };
        }
      }
  };

  ngOnDestroy() {
    // this.shoppingCartSub.unsubscribe();
    this.cartProducts = [];
  };

}
