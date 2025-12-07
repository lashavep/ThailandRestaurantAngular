// ManageOrdersComponent
// გამოიყენება შეკვეთების ადმინისტრატორის მიერ შეკვეთების მართვისთვის.
// OrderService.getOrdersByStatus() იღებს შეკვეთებს სტატუსის მიხედვით (/api/orders/GetAllOrders).
// OrderService.acceptOrder() ადასტურებს შეკვეთას.
// OrderService.rejectOrder() უარყოფს შეკვეთას.

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
  imports: [CommonModule, TranslateModule, MatExpansionModule]
})
export class ManageOrdersComponent implements OnInit {
  pendingOrders: any[] = [];
  completeOrders: any[] = [];
  rejectedOrders: any[] = [];
  pendingPage = 1;
  pendingTotalPages = 1;

  completePage = 1;
  completeTotalPages = 1;

  rejectedPage = 1;
  rejectedTotalPages = 1;

  pageSize = 4;

  constructor(public orderService: OrderService, private dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit() {
    this.loadPendingOrders();
    this.loadCompleteOrders();
    this.loadRejectedOrders();
  }

  loadPendingOrders() {
    this.orderService.getOrdersByStatus('Pending', this.pendingPage, this.pageSize).subscribe(res => {
      this.pendingOrders = res.orders;
      this.pendingTotalPages = Math.ceil(res.totalCount / this.pageSize);
      this.orderService.setPendingCount(res.totalCount);
    });
  }

  loadCompleteOrders() {
    this.orderService.getOrdersByStatus('Complete', this.completePage, this.pageSize).subscribe(res => {
      this.completeOrders = res.orders;
      this.completeTotalPages = Math.ceil(res.totalCount / this.pageSize);
    });
  }

  loadRejectedOrders() {
    this.orderService.getOrdersByStatus('Rejected', this.rejectedPage, this.pageSize).subscribe(res => {
      this.rejectedOrders = res.orders;
      this.rejectedTotalPages = Math.ceil(res.totalCount / this.pageSize);
    });
  }



  acceptOrder(orderId: number) {
    this.translate.get('admin.confirmAccept').subscribe((message: string) => {
      const confirmed = window.confirm(message);
      if (!confirmed) return;

      this.orderService.acceptOrder(orderId).subscribe(() => {
        const order = this.pendingOrders.find(o => o.id === orderId);
        if (order) {
          order.status = 'Complete';
          this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);
          this.completeOrders.push(order);
        }
        this.orderService.setPendingCount(this.pendingOrders.length);

        alert(this.translate.instant('admin.acceptSuccess'));

        this.loadPendingOrders();
        this.loadCompleteOrders();
      });
    });
  }


  viewOrder(order: any) {
    this.dialog.open(OrderDetailsDialogComponent, {
      width: '600px',
      data: { orderId: order.id }
    });
  }

  rejectOrder(orderId: number) {
    this.translate.get('admin.confirmReject').subscribe((message: string) => {
      const confirmed = window.confirm(message);
      if (!confirmed) return;

      this.orderService.rejectOrder(orderId).subscribe(() => {
        const order = this.pendingOrders.find(o => o.id === orderId);
        if (order) {
          order.status = 'Rejected';
          this.pendingOrders = this.pendingOrders.filter(o => o.id !== orderId);
          this.rejectedOrders.push(order);
        }
        this.orderService.setPendingCount(this.pendingOrders.length);

        alert(this.translate.instant('admin.rejectSuccess'));

        this.loadPendingOrders();
        this.loadCompleteOrders();
      });
    });
  }

  nextPendingPage() {
    if (this.pendingPage < this.pendingTotalPages) {
      this.pendingPage++;
      this.loadPendingOrders();
    }
  }

  prevPendingPage() {
    if (this.pendingPage > 1) {
      this.pendingPage--;
      this.loadPendingOrders();
    }
  }

  nextCompletePage() {
    if (this.completePage < this.completeTotalPages) {
      this.completePage++;
      this.loadCompleteOrders();
    }
  }

  prevCompletePage() {
    if (this.completePage > 1) {
      this.completePage--;
      this.loadCompleteOrders();
    }
  }

  nextRejectedPage() {
    if (this.rejectedPage < this.rejectedTotalPages) {
      this.rejectedPage++;
      this.loadRejectedOrders();
    }
  }

  prevRejectedPage() {
    if (this.rejectedPage > 1) {
      this.rejectedPage--;
      this.loadRejectedOrders();
    }
  }


}
