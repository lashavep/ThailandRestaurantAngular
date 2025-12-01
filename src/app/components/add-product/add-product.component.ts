import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
import { ICategory } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  categories: ICategory[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private translate: TranslateService,
    private categoryService: CategoriesService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      image: [''],
      spiciness: [0],
      vegeterian: [false],
      nuts: [false],
      categoryName: ['', Validators.required],
      ingredients: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        Swal.fire('❌', 'Failed to load categories', 'error');
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const raw = this.form.value;

      const payload = {
        ...raw,
        ingredients: raw.ingredients
          ? raw.ingredients.split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0)
          : []
      };

      this.adminService.createProduct(payload).subscribe({
        next: () => {
          Swal.fire('✔️', this.translate.instant('admin.add.success'), 'success');
          this.form.reset();
        },
        error: () => {
          Swal.fire('❌', this.translate.instant('admin.add.error'), 'error');
        }
      });
    }
  }
}

