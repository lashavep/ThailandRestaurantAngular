// OrdersComponent
// გამოიყენება მომხმარებლის შეკვეთების სანახავად.
// OrderService.getOrders() იღებს შეკვეთების სიას API-დან (/api/orders/myOrders).

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  imports: [CommonModule, TranslateModule]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  currentPage = 1;
  pageSize = 3; 


  get pagedOrders(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize);
  }

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
    this.orders = data.map(order => ({
      ...order,
      date: new Date(order.date)
    }));
  },
      error: () => this.orders = []
    });
  }
}
