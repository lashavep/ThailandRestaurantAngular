// CategoryComponent
// გამოიყენება კონკრეტული კატეგორიის პროდუქტების სანახავად.
// CategoriesService.getCategoryById() იღებს კატეგორიის დეტალებს.
// ProductService.getProductsByCategory(categoryId) იღებს პროდუქტებს კონკრეტული კატეგორიიდან.

import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ICategory } from '../../models/category.model';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule, NgClass, TranslateModule],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.css'
})
export class CategoriesComponent {
    @Input() categories!: ICategory[];
    @Output() selected = new EventEmitter<number>();

    selectedId: number = 0;
    isOpen: boolean = false;

    closeCategories() {
        this.isOpen = false;
    }


    selectCategory(id: number) {
        this.selectedId = id;
        this.selected.emit(id);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: UIEvent) {
        const windowWidth = (event.target as Window).innerWidth;
        if (windowWidth > 720 && this.isOpen) {
            this.closeCategories();
        }
    }
}
