import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { IProduct } from "../models/product.model";
import { Injectable } from "@angular/core";
import { IUser } from "../models/user.model";
import { AdminProductDto } from "../models/AdminProductDto";

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = 'https://localhost:7183/api/Admin';
  private userApi = 'https://localhost:7183/api/Users';

  constructor(private http: HttpClient, private auth: AuthService) { }


  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.api}/GetAllProduct`, this.auth.getAuthHeaders());
  }

  createProduct(dto: AdminProductDto): Observable<any> {
    return this.http.post(`${this.api}/CreateProduct`, dto, this.auth.getAuthHeaders());
  }

  updateProduct(product: IProduct): Observable<void> {
    return this.http.put<void>(`${this.api}/UpdateProduct/${product.id}`, product, this.auth.getAuthHeaders());
  }

  sendPromoEmail(subject: string, body: string): Observable<any> {
    return this.http.post(
      `${this.api}/SendPromoEmail`,
      { subject, body },
      this.auth.getAuthHeaders()
    );
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.api}/DeleteProduct/${id}`, {
      ...this.auth.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.userApi}`, this.auth.getAuthHeaders());
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.userApi}/delete/${id}`, {
      ...this.auth.getAuthHeaders(),
      responseType: 'text'
    });
  }

  registerUser(dto: any): Observable<any> {
    return this.http.post(`${this.userApi}/UserRegister`, dto, this.auth.getAuthHeaders());
  }

  promoteUserByEmail(email: string, newRole: string): Observable<string> {
    return this.http.put(`${this.api}/PromoteUserByEmail?email=${email}&newRole=${newRole}`, null, {
      ...this.auth.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
