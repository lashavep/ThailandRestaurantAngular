import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { IProduct } from '../../models/product.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ICategory } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, TranslateModule, MatDialogModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  loading = false;
  page = 1;
  pageSize = 7;

  constructor(
    private adminService: AdminService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.adminService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        Swal.fire('❌', this.translate.instant('admin.load.error'), 'error');
        this.loading = false;
      }
    });
  }

  editProduct(product: IProduct): void {
  const dialogRef = this.dialog.open(EditProductDialogComponent, {
    width: '500px',
    maxHeight: '90vh',
    data: { product, categories: this.categories }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.adminService.updateProduct(result).subscribe({
        next: () => {
          Swal.fire('✔️', this.translate.instant('admin.editConfirm.success'), 'success');
          this.loadProducts();
        },
        error: () => {
          Swal.fire('❌', this.translate.instant('admin.editConfirm.error'), 'error');
        }
      });
    }
  });
}


  deleteProduct(id: number): void {
    Swal.fire({
      title: this.translate.instant('admin.deleteConfirm.title'),
      text: this.translate.instant('admin.deleteConfirm.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('admin.deleteConfirm.confirm'),
      cancelButtonText: this.translate.instant('admin.deleteConfirm.cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire(
              '✔️',
              this.translate.instant('admin.deleteConfirm.success'),
              'success'
            );
            this.loadProducts();
          },
          error: () => {
            Swal.fire(
              '❌',
              this.translate.instant('admin.deleteConfirm.error'),
              'error'
            );
          }
        });
      }
    });
  }

  getSpicinessLabel(level: number): string {
    switch (level) {
      case 0:
        return this.translate.instant('admin.table.spiceLevel.notSpicy');
      case 1:
        return this.translate.instant('admin.table.spiceLevel.mild');
      case 2:
        return this.translate.instant('admin.table.spiceLevel.medium');
      case 3:
        return this.translate.instant('admin.table.spiceLevel.hot');
      case 4:
        return this.translate.instant('admin.table.spiceLevel.extra');
      default:
        return '-';
    }
  }
}
