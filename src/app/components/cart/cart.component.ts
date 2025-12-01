import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { CartWelcomeComponent } from '../cart-welcome/cart-welcome.component';
import { CartItemListComponent } from '../cart-itemlist/cart-itemlist.component';
import { AuthService } from '../../services/auth.service';


import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartWelcomeComponent, CartItemListComponent, CommonModule, TranslateModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {
  totalPrice: number = 0;
  isLoading: boolean = true;
  selectedLanguage: string = 'en'

  constructor(private basketService: BasketService, private authService: AuthService, private router: Router, private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage)
  }
  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }

  proceedToPayment() {
    if (this.totalPrice === 0) {
      Swal.fire({
        title: this.translateService.instant('cart.emptyTitle'),
        text: this.translateService.instant('cart.emptyText'),
        icon: 'warning',
        confirmButtonText: this.translateService.instant('cart.ok')
      });
    } else {
      this.router.navigate(['/payment']);
    }
  }


  logout() {
    Swal.fire({
      title: this.translateService.instant('header.confirmLogout'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('header.yesLogout'),
      cancelButtonText: this.translateService.instant('header.cancel'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/']);
        Swal.fire({
          title: 'logged Out',
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        })
      }
    });
  }

  ngOnInit() {
    this.basketService.totalPrice$.subscribe(price => this.totalPrice = price);
    this.basketService.loadBasket();
  }
}
