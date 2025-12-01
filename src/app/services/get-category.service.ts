import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetCategory } from '../models/get-category.model';

@Injectable({
    providedIn: 'root'
})
export class GetCategoryService {
    private apiUrl = "https://localhost:7183/api";

    constructor(private http: HttpClient) { }

    getCategory(id: number): Observable<IGetCategory> {
        const url = `${this.apiUrl}/Categories/GetCategory/${id}`

        return this.http.get<IGetCategory>(url);
    }
}
