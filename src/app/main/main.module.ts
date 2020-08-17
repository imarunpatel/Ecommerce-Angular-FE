import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { MainSliderComponent } from './main-slider/main-slider.component';
import { PromiseBannerComponent } from './promise-banner/promise-banner.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MainRoutingModule} from './main-routings.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShopByCategoryComponent } from './shop-by-category/shop-by-category.component';
import { BestProductBannerComponent } from './best-product-banner/best-product-banner.component';


@NgModule({
    declarations: [
        MainSliderComponent,
        PromiseBannerComponent,
        ProductsComponent,
        MainComponent,
        ProductDetailsComponent,
        ShoppingCartComponent,
        ShopByCategoryComponent,
        BestProductBannerComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        AngularMaterialModule,
        MatProgressSpinnerModule,
        MainRoutingModule
    ],
    exports: [
        RouterModule
    ]
})
export class MainModule {}
