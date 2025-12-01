import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { IFilterData } from '../models/filter-data.model';
import { IProduct } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class FilterProductsService {
    private apiUrl = "https://localhost:7183/api";

    constructor(private http: HttpClient) { }

    filterProducts(filterData: IFilterData, categoryId: number): Observable<IProduct[]> {
        const url = `${this.apiUrl}/Products/GetFiltered`;

        let spiciness = filterData.spiciness;
        let vegetarian = filterData.vegetarian;
        let nuts = filterData.nuts;

        let params = new HttpParams();

        if (categoryId !== 0) {
            params = params.append("categoryId", categoryId);
        }
        if (spiciness !== 0) {
            params = params.append("spiciness", spiciness - 1);
        }
        if (vegetarian) {
            params = params.append("vegeterian", vegetarian);
        }
        if (nuts) {
            params = params.append("nuts", !nuts);
        }

        return this.http.get<IProduct[]>(url, { params: params });
    }
}
