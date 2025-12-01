import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product.model';
import { IngredientDialogService } from '../../services/ingredient-dialog.service';
import Swal from 'sweetalert2';
import { IIngredients } from '../../models/ingredients.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product!: IProduct;
  @Input() buttonText: string = 'Add to Cart';
  @Input() isLoaded: boolean = true;

  @Output() add = new EventEmitter<IProduct>();
  @Output() goToCart = new EventEmitter<void>();

  spicinessLevels: { [key: string]: string } = {
    0: "Not Spicy",
    1: "Mildly Spicy",
    2: "Fairly Spicy",
    3: "Spicy",
    4: "Extra Spicy"
  };

  isPopupVisible = false;
  selectedIngredient: IIngredients[] = [];

  constructor(private ingredientDialog: IngredientDialogService, private auth: AuthService, private router: Router) { }


  onClick() {
    if (this.buttonText === 'Go to Cart') {
      this.goToCart.emit();
    } else {
      this.add.emit(this.product);
    }
  }

  handleClick() {
    if (!this.auth.isLoggedIn()) {
      Swal.fire({
        title: 'You must log in to add to cart',
        text: 'Would you like to sign in now?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sign in',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }
      });
      return;
    }

    this.add.emit(this.product);
  }

  addToCart(product: IProduct) {
    this.add.emit(product);
  }


  getSpecificIngredient(id: number): void {
    this.ingredientDialog.fetchIngredientById(id).subscribe({
      next: (ingredients: IIngredients[]) => {
        this.selectedIngredient = ingredients;
        this.isPopupVisible = true;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Ingredient not found',
          text: `No ingredient found for product ID ${id}`
        });
      }
    });
  }



  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedIngredient = [];
  }
}
