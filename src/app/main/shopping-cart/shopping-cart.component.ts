import { Component, OnInit, OnDestroy } from '@angular/core';
import {ShoppingCartService} from '../../shared/shopping-cart.service';
import {AuthService} from '../../auth/auth.service';
import {ProductService} from '../../shared/product.service';
import { Subscription } from 'rxjs';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{

  faStar = faStar;
  faTrash = faTrash;

  userId: number;
  productIds: [];
  cartProducts = [];
  cartStatus: string;
  cartIsEmpty: boolean = true;
  isLoading = true;
  shoppingCartSub: Subscription;
  totalPrice = 0;
  noOfProducts = 0;
  showCartEmptyMessage = false;
  productQtyProcessing;



  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private productService: ProductService
  ) {
    this.userId = +localStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.gettingCartItemForAuthUser();
    
  };

  gettingCartItemForAuthUser() {
    if (this.authService.getIsAuth()) {
      // Getting product ids associated with the loggedin user
      this.shoppingCartService.getCartItems(this.userId).subscribe(
        (data: any) => {
              this.productIds = data;
              if (data.length > 0) {
                this.cartIsEmpty = false
              }
              else {
                this.cartIsEmpty = true;
                this.showCartEmptyMessage = true;
                this.isLoading = false;
                this.authService.cartLengthListener.next(0);
              }
              this.getProducts(this.productIds);
          }
          );
        } else {
          this._getProducts();
          this.isLoading = false;
            if (this.shoppingCartService._cartProducts.length > 0) {
              this.cartIsEmpty = false;
            } else {
              this.cartIsEmpty = true;
              this.showCartEmptyMessage = true;
            }
        }
  }

  _getProducts() { 
    this.shoppingCartService._cartProducts.forEach(element => {
      this.shoppingCartService._getProductById(element).subscribe(
        (data: any) => {
          const priceAccToNoOfProducts = data.price * 1;
          this.totalPrice = this.totalPrice + data.price;
          const newData = {item: data, qty: 1, cartId: 0, priceAccToNoOfProducts: priceAccToNoOfProducts}
          this.cartProducts.push(newData);

        }
      )
    });
  }

  getProducts(productIds) {
    for(const ids in productIds) {
      this.productService.getProductById(productIds[ids].product_id).subscribe(
        (data: any) => {
          const priceAccToNoOfProducts = data.price * productIds[ids].qty;
          const newData = {item: data, qty: productIds[ids].qty, cartId: productIds[ids].id, priceAccToNoOfProducts: priceAccToNoOfProducts};

          this.totalPrice = this.totalPrice + newData.priceAccToNoOfProducts;
          this.noOfProducts = this.noOfProducts + 1;

          this.cartProducts.push(newData);
          this.isLoading = false;
        }
      );
    };
  };

  checkCartId;
  onPlus(product) {
    if(this.authService.getIsAuth()) {
      this.checkCartId = product.cartId;
      this.productQtyProcessing = true;
      product.qty = product.qty + 1;
      const data = {cartId: product.cartId, qty: product.qty, productId: product.item.id};

      product.priceAccToNoOfProducts = product.priceAccToNoOfProducts + product.item.price;
      this.totalPrice = this.totalPrice + product.item.price;

      this.shoppingCartService.changeCartProductQty(data).subscribe(
        (data: any) => {
              this.productQtyProcessing = false;
              this.checkCartId = 0;
        }
      );
    } else {
      product.qty = product.qty + 1;
      product.priceAccToNoOfProducts = product.priceAccToNoOfProducts + product.item.price;
      this.totalPrice = this.totalPrice + product.item.price;
    }
  };

  onMinus(product) {
    if(this.authService.getIsAuth()) {
      this.checkCartId = product.cartId;
      this.productQtyProcessing = true;
      product.qty = product.qty - 1;
      if (product.qty == 0 ) {
        this.onDeleteItem(product);
        product.priceAccToNoOfProducts = product.priceAccToNoOfProducts - product.item.price;
        this.totalPrice = this.totalPrice - product.item.price;
        return ;
      }
      const data = {cartId: product.cartId, qty: product.qty, productId: product.item.id};

      product.priceAccToNoOfProducts = product.priceAccToNoOfProducts - product.item.price;
      this.totalPrice = this.totalPrice - product.item.price;

      this.shoppingCartService.changeCartProductQty(data).subscribe(
        (data) => {

          this.productQtyProcessing = false;
          this.checkCartId = 0;
        }
      );
    } else {
      product.qty = product.qty - 1;
      if (product.qty == 0 ) {
        this.cartProducts = this.cartProducts.filter(item => item.qty != product.qty);
      }
      if (this.cartProducts.length == 0) {
        this.cartIsEmpty = true;
        this.showCartEmptyMessage = true;
        this.authService.cartLengthListener.next(0);
      }
      product.priceAccToNoOfProducts = product.priceAccToNoOfProducts - product.item.price;
      this.totalPrice = this.totalPrice - product.item.price;
      }
  };

  onDeleteItem(product) {
    this.shoppingCartService.deleteCartItem(product.cartId).subscribe(
      () => {
        this.cartProducts = this.cartProducts.filter(item => item.cartId != product.cartId);
        if (this.cartProducts.length == 0) {
          this.cartIsEmpty = true;
          this.showCartEmptyMessage = true;
          this.authService.cartLengthListener.next(0);
        }
      }
    );

  }

  ngOnDestroy() {
    // this.shoppingCartSub.unsubscribe();
    this.cartProducts = [];
  };

}
