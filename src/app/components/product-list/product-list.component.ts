import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';
import { IPartialProduct } from '../../models/partial-product.model';
import { ProductComponent } from '../product/product.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IBasketItem } from '../../models/basketItem.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products!: IProduct[];
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 3;
  @Input() isLoaded!: boolean;

  loaders = Array(12).fill(0);
  addedProductIds: number[] = [];

  constructor(
    public basketService: BasketService,
    public router: Router,
    private authService: AuthService,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    this.basketService.loadBasket();
  }

  get pagedProducts(): IProduct[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  addToCart(product: IProduct) {
    if (!product || product.id == null) {
      console.warn('addToCart called with invalid product', product);
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        title: this.translateService.instant('productList.loginRequiredTitle'),
        text: this.translateService.instant('productList.loginRequiredText'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.translateService.instant('productList.goToLogin'),
        cancelButtonText: this.translateService.instant('productList.cancel')
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    if (this.addedProductIds.includes(product.id)) {
      this.router.navigate(['/cart']);
      return;
    }

    if (this.basketService.isInBasket(product.id)) {
      Swal.fire({
        title: this.translateService.instant('productList.alreadyInCart'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // DTO payload
    const newProd: IPartialProduct = {
      quantity: 1,
      price: product.price,
      productId: product.id
    };

    // BasketItem model
    const newBasketItem: IBasketItem = {
      id: 0, // backend შექმნის
      basketId: 0,
      productId: product.id,
      product: product,
      quantity: 1,
      price: product.price
    };

    this.basketService.addToBasket(newProd).subscribe({
      next: basket => {
        this.addedProductIds.push(product.id);
        Swal.fire({
          title: this.translateService.instant('productList.addedSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
      },
      error: err => {
        console.error('Failed to add to basket', err);
        Swal.fire({
          title: this.translateService.instant('productList.errorTitle'),
          text: this.translateService.instant('productList.errorText'),
          icon: 'error'
        });
      }
    });
  }
}
