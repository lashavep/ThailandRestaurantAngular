import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'https://localhost:7183';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createOrder(order: any) {
    return this.http.post(
      `${this.baseUrl}/api/orders/placeOrder`,
      order,
      this.authService.getAuthHeaders()
    );
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/api/orders/myOrders`,
      this.authService.getAuthHeaders()
    );
  }

  getAllOrders(page: number, pageSize: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {

      return of({ items: [], totalCount: 0 });
    }
    return this.http.get<any>(
      `${this.baseUrl}/api/orders/GetAllOrders?page=${page}&pageSize=${pageSize}`,
      this.authService.getAuthHeaders()
    );
  }

  getOrdersByStatus(status: string, page: number, pageSize: number): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of({ items: [], totalCount: 0 });
    }
    return this.http.get<any>(
      `${this.baseUrl}/api/orders/GetAllOrders?status=${encodeURIComponent(status)}&page=${page}&pageSize=${pageSize}`,
      this.authService.getAuthHeaders()
    );
  }

  acceptOrder(orderId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/orders/acceptOrder/${orderId}`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  rejectOrder(orderId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/orders/rejectOrder/${orderId}`,
      {},
      this.authService.getAuthHeaders()
    );
  }


  private pendingCountSubject = new BehaviorSubject<number>(0);
  pendingCount$ = this.pendingCountSubject.asObservable();

  setPendingCount(count: number) {
    this.pendingCountSubject.next(count);
  }

  loadPendingCount() {
    this.getOrdersByStatus('Pending', 1, 100).subscribe(res => {
      if (res) {
        this.setPendingCount(res.totalCount ?? 0);
      } else {
        this.setPendingCount(0);
      }
    });
  }
}
