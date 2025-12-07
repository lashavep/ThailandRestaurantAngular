// HomeComponent
// გამოიყენება მთავარი გვერდის საჩვენებლად.
// აქ მომხმარებელი ხედავს პროდუქტების სიას, კატეგორიებს და რეკომენდაციებს.
// CategoriesService.getCategories() იღებს კატეგორიებს API-დან (/api/Categories).

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ICategory } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { IProduct } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { GetCategoryService } from '../../services/get-category.service';
import { IFilterData } from '../../models/filter-data.model';
import { FilterProductsService } from '../../services/filter-products.service';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CategoriesComponent, ProductListComponent, FilterComponent, RouterModule, LoaderComponent, NgIf, TranslateModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    @ViewChild(FilterComponent) filterComponent!: FilterComponent;

    categories: ICategory[] = [];
    products: IProduct[] = [];
    selectedCategory: number = 0;
    currentPage: number = 1;
    pageSize: number = 6;
    isLoaded: boolean = false;
    isLoading: boolean = true


    constructor(
        private categoriesService: CategoriesService,
        private productsService: ProductsService,
        private getCategoryService: GetCategoryService,
        private filterProductsService: FilterProductsService
    ) { }


    ngOnInit(): void {
        this.getCategories();
        this.getProducts();
    }

    goToPage(page: number) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    get totalPages(): number {
        return Math.ceil(this.products.length / this.pageSize);
    }


    getCategories(): void {
        this.categoriesService.getCategories().subscribe(categories => this.categories = categories);
    }

    getProducts(): void {
        this.loadAllProducts();

        this.isLoading = false
    }

    selectCategory(id: number) {
        if (this.selectedCategory !== id) {
            this.resetProucts();
            this.selectedCategory = id;
            this.currentPage = 1;
            if (this.filterComponent.isFiltered) {
                this.loadFiltered(this.filterComponent.filterData, id);
            } else {
                this.loadByCategories(id);
                this.currentPage = 1;
            }
        }
    }

    filterProducts(filterData: IFilterData) {
        this.resetProucts();
        this.loadFiltered(filterData, this.selectedCategory);
        this.currentPage = 1;
    }

    resetProucts() {
        this.isLoaded = false;
        this.products = [];
        this.currentPage = 1;
    }

    loadFiltered(filterData: IFilterData, id: number) {
        this.filterProductsService.filterProducts(filterData, id)
            .subscribe(filtered => {
                this.products = filtered;
                this.isLoaded = true;
                this.currentPage = 1;
            });
    }

    loadByCategories(id: number) {
        if (id === 0) {
            this.loadAllProducts();
        } else {
            this.loadSingleCategory(id);
            this.currentPage = 1;
        }
    }

    loadAllProducts() {
        this.productsService.getProducts().subscribe(products => {
            this.products = products;
            this.isLoaded = true;
            this.currentPage = 1;
        });
    }

    loadSingleCategory(id: number) {
        this.getCategoryService.getCategory(id).subscribe(category => {
            this.products = category.products
            this.isLoaded = true;
            this.currentPage = 1;
        });
    }
}

