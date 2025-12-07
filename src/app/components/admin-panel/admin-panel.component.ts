// AdminPanelComponent
// გამოიყენება ადმინისტრატორის პანელისთვის.
// AdminService.getAllUsers() იღებს ყველა მომხმარებელს (/api/Users).
// AdminService.manageProducts() მართავს პროდუქტებს (/api/Products).
// AdminService.promoteUserByEmail() მომხმარებელს ანიჭებს ადმინისტრატორის როლს (/api/Admin/promoteUser).

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';
import { OrderService } from '../../services/order.service';



@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ]
})

export class AdminPanelComponent implements OnInit {
  pendingOrders: any[] = [];

  constructor(public orderService: OrderService) {}

  ngOnInit() {
    this.orderService.loadPendingCount();
    this.orderService.getAllOrders(1, 10).subscribe(res => {
      this.pendingOrders = res.orders.filter((o: any) => o.status === 'Pending');
    });
  }
}


