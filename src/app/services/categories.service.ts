import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private apiUrl = "https://localhost:7183/api/Categories";

    constructor(private http: HttpClient) { }

    getCategories(): Observable<ICategory[]> {
        const url = `${this.apiUrl}/GetAll`
        return this.http.get<ICategory[]>(url);
    }
    addCategory(name: string): Observable<ICategory> {
        return this.http.post<ICategory>(`${this.apiUrl}/Add`, {name});
    }


    deleteCategory(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Delete/${id}`);
    }
}
