import {NgModule} from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {ProductDetailsComponent} from './products/product-details/product-details.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'cart', component: ShoppingCartComponent},
  { path: ':slug', component: ProductDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
