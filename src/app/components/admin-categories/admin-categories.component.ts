import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoriesService } from '../../services/categories.service';
import { ICategory } from '../../models/category.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  standalone: true,
  styleUrls: ['./admin-categories.component.css'],
  imports: [CommonModule, FormsModule, TranslateModule]
})
export class AdminCategoriesComponent implements OnInit {
  categories: ICategory[] = [];
  newCategoryName: string = '';

  constructor(private categoryService: CategoriesService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.addCategory(this.newCategoryName).subscribe({
      next: (cat) => {
        Swal.fire('✔️', `Category "${cat.name}" added`, 'success');
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: () => Swal.fire('❌', 'Failed to add category', 'error')
    });
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: this.translateService.instant('admin.table.categories.confirmTitle'),
      text: this.translateService.instant('admin.table.categories.confirmText', { id }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translateService.instant('admin.table.categories.confirmDelete'),
      cancelButtonText: this.translateService.instant('admin.table.categories.cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire(
              '🗑️',
              this.translateService.instant('admin.table.categories.deletedMessage', { id }),
              'success'
            );
            this.loadCategories();
          },
          error: () =>
            Swal.fire('❌', this.translateService.instant('admin.table.categories.deleteError'), 'error')
        });
      }
    });
  }
}
