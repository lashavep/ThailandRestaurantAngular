import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  createOrder(order: any) {
    return this.http.post('https://localhost:7183/api/orders/placeOrder', order, this.authService.getAuthHeaders());
  }

  getOrders(): Observable<any[]> {
    const userId = this.authService.getUserId();
    return this.http.get<any[]>(`https://localhost:7183/api/orders/my`, this.authService.getAuthHeaders());
  }

  getAllOrders(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `https://localhost:7183/api/orders/all?page=${page}&pageSize=${pageSize}`,
      this.authService.getAuthHeaders()
    );
  }

  getOrdersByStatus(status: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(
      `https://localhost:7183/api/orders/all?status=${status}&page=${page}&pageSize=${pageSize}`,
      this.authService.getAuthHeaders()
    );
  }


  acceptOrder(orderId: number): Observable<any> {
    return this.http.post(
      `https://localhost:7183/api/orders/acceptOrder/${orderId}`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  rejectOrder(orderId: number) {

    return this.http.post(`https://localhost:7183/api/orders/rejectOrder/${orderId}`, {}, this.authService.getAuthHeaders());
  }


  private pendingCountSubject = new BehaviorSubject<number>(0);
  pendingCount$ = this.pendingCountSubject.asObservable();

  setPendingCount(count: number) {
    this.pendingCountSubject.next(count);
  }

  loadPendingCount() {
  this.getOrdersByStatus('Pending', 1, 100).subscribe(res => {
    this.setPendingCount(res.totalCount);
  });
}


}
