import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private apiUrl = "https://localhost:7183/api"

    constructor(private http: HttpClient, private auth: AuthService) { }

    getProducts(): Observable<IProduct[]> {
        const url = `${this.apiUrl}/Products/GetAllProduct`
        return this.http.get<IProduct[]>(url);
    }
}
