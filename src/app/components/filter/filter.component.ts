import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output, } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { IFilterData } from '../../models/filter-data.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() filter = new EventEmitter<IFilterData>();

  public isFiltered: boolean = false;
  isOpen: boolean = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const windowWidth = (event.target as Window).innerWidth;
    if (windowWidth > 720 && this.isOpen) {
      this.closeFilter();
    }
  }
  

  spicinessLevels: { [key: string]: string } = {
    0: "Not Selected",
    1: "Not Spicy",
    2: "Mildly Spicy",
    3: "Fairly Spicy",
    4: "Spicy",
    5: "Extra Spicy"
  };

  filterData: IFilterData = {
    spiciness: 0,
    vegetarian: false,
    nuts: false
  };

  filterProducts() {
    this.closeFilter();
    this.isFiltered = true;
    this.filter.emit(this.filterData);
  }

  resetFilter() {
    this.closeFilter();
    this.isFiltered = false;
    this.filterData.spiciness = 0;
    this.filterData.vegetarian = false;
    this.filterData.nuts = false;
    this.filter.emit(this.filterData);
  }

  closeFilter() {
    this.isOpen = false;
  }
}


