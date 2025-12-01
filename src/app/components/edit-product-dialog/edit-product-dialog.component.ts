import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from '../../models/product.model';
import { ICategory } from '../../models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule]
})
export class EditProductDialogComponent {
  form: FormGroup;
  categories: ICategory[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: IProduct, categories: ICategory[] }
  ) {
    this.categories = data.categories;
    this.form = this.fb.group({
      id: [data.product.id],
      name: [data.product.name, Validators.required],
      price: [data.product.price, Validators.required],
      image: [data.product.image],
      spiciness: [data.product.spiciness],
      vegeterian: [data.product.vegeterian],
      nuts: [data.product.nuts],
      categoryName: [data.product.categoryName],
      ingredients: [data.product.ingredients?.join(', ')]
    });
  }

  save(): void {
    if (this.form.valid) {
      const value = this.form.value;
      value.ingredients = value.ingredients
        .split(',')
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0);
      this.dialogRef.close(value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
