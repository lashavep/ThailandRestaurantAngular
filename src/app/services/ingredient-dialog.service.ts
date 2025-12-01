import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IIngredients } from '../models/ingredients.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientDialogService {
  private apiUrl = 'https://localhost:7183/api/Ingredients';

  constructor(private http: HttpClient) {}

  fetchIngredientById(id: number): Observable<IIngredients[]> {
    return this.http.get<IIngredients[]>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Failed to fetch ingredient:', error);
        return throwError(() => error);
      })
    );
  }
}
