import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Isignup } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  apiUrl = 'https://localhost:7183/api/Auth/sign_up'

  signup(data: Isignup): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
