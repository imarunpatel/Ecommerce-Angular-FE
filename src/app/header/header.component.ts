import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartService } from '../shared/shopping-cart.service';

declare var $: any;
 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  cartLength;
  cartLenthStatus;

  changeNavbarColor = false;
  userName: string;
  public _opened: boolean = false;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  private nameListenerSubs: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
    ) {
    router.events.subscribe( e => {
      if (e instanceof NavigationEnd) {
        if (this.router.url !== '/') {
          this.changeNavbarColor = true
        }
        else {
          this.changeNavbarColor = false;
        }
      }
    });
   }
  


  ngOnInit(): void {
    $(function () {
      $(document).scroll(function () {
        var $nav = $(".navbar");
        $nav.toggleClass('scrolled fixed-top animate__animated animate__bounceInRight', $(this).scrollTop() > $nav.height());
      });
    });
    //Get User Name
    this.nameListenerSubs = this.authService.getLoggedInName.subscribe(
      name => {
        this.changeName(name);
        this.cartLenthStatus = true;
      }
    );
    
    // User LoggedIn Status
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => { 
        this.userIsAuthenticated = isAuthenticated;
      }
      );
    this.authService.verifyLoginStatus();

    if(this.authService.getAuthStatusListener()) {
      this.authService.cartLengthListener.subscribe(
        data => {
          this.cartLenthStatus = true;
          this.cartLength = data;
        }
      );
    } 

    


    if(!localStorage.getItem('userId')) {
      this.shoppingCartService._cartLengthListener.subscribe(
        data => {
          // this.cartLenthStatus = true;
          this.cartLength = data;
        }
      );
    }

    this.shoppingCartService.cartStatusListener.subscribe(
      (data: any) => {
        this.cartLenthStatus = data;
      }
    )
  

    if(this.authService.getAuthStatusListener()) {
      this.getCartLength();
    }

  }

  getCartLength() {
    const userId = +localStorage.getItem('userId');
    this.shoppingCartService.getCartItems(userId).subscribe(
      (data) => {
        this.cartLength = data.length;
        // this.cartLenthStatus = true;
      }
    );
  }

  private changeName(name) {
    this.userName = name;
  }

  public onLogout() {
    this.authService.doLogout();
    this.cartLenthStatus = false;
  }


  
public onToggleSidenav = () => { 
 
}

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.nameListenerSubs.unsubscribe();
  }

}
