import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductService } from '../../shared/product.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {ShoppingCartService} from '../../shared/shopping-cart.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:ban-types
  products: Object = [];
  productSub: Subscription;
  faStar = faStar;
  isLoading = false;
  mainUrl = environment.mainUrl;

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    // this.products = this.productService.getProducts();
    this.productSub = this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.isLoading = false;
      }
    );
  }

  onProductAdded(product) {
    const id = product.id;
    this.shoppingCartService.addProductOnCart(id).subscribe(
      (data: any) => {
        console.log(data);
      }
    );
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }


}
