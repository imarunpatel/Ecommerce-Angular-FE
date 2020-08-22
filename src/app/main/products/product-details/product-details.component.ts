import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/product.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Product} from '../../../shared/Product';
import { ShoppingCartService } from 'src/app/shared/shopping-cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  faStar = faStar;
  productSlug;
  productDetails: Product;
  isLoading = true;
  featuredImg = '';
  mainUrl = environment.mainUrl;
  cartButtonProcessing;

  pinForm = this.fb.group({
    pinNumber: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productSlug = this.route.snapshot.paramMap.get('slug');
    this.getProduct(this.productSlug);

    // if(!this.productDetails.product_images) {
    //   this.featuredImg = this.productDetails.product_images;
    //   console.log(this.featuredImg);
    // } else {
    //   this.featuredImg = null;
    // }
  }

  getProduct(productSlug) {
    this.productService.getProduct(productSlug).subscribe(
      (data: any) => {
        this.productDetails = { ...data };
        if (data.images.length > 0) {
          this.featuredImg = data.images[0].image;
        }
        this.isLoading = false;
      }
    );
  }

  onPinCheck() {
    console.log(this.pinForm.value);
  };

  productFound = 0;
  cartAddButtonStatus = 'Add to Bag';
  onProductAdded() {
    if(this.authService.getIsAuth()) {
      this.cartButtonProcessing = true;
      const userId = +localStorage.getItem('userId');
      const id = this.productDetails.id;
      this.shoppingCartService.getCartItems(userId).subscribe(
        (data: any) => {
          
          data.forEach(element => {
            if(element.product_id == id) {
              this.productFound = 1;
            }
          });
          if(this.productFound == 1){
            // console.log('product found');
            this.cartAddButtonStatus = 'Already Added';
            this.cartButtonProcessing = false;
          } else {
            // console.log('product not found');
            this.shoppingCartService.addProductOnCart(id).subscribe(
              (data: any) => {
                this.authService.getCartLength(userId);
                this.cartAddButtonStatus = 'Added';
                this.cartButtonProcessing = false;
              }
            );
          };
        }
      );
    } else {
      this.cartButtonProcessing = true;
      const id = this.productDetails.id;
      let cartStatus = 0;
      const cartItemsId = this.shoppingCartService._getCartItems();
      cartItemsId.forEach(element => {
          if (id == element) {
            cartStatus = 1;
          } 
      });
      if(cartStatus == 1) {
        this.cartAddButtonStatus = 'Already Added';
        this.cartButtonProcessing = false;
      } else {
        this.shoppingCartService._addProductOnCart(id);
        this.cartAddButtonStatus = 'Added';
        this.cartButtonProcessing = false;
        this.shoppingCartService._getCartLengthListener();
      };
    };
  };

  onSelect(img) {
    // console.log('img', img);
    // this.featuredImg = img
    this.productService.getProduct(this.productSlug).subscribe(
      (data:any) => {
        data.images.forEach(element => {
          if(img.image == element.image) {
            this.featuredImg = element.image;
          }
          // console.log('image: ', element.image)
        });
      }
    );
  }
}
