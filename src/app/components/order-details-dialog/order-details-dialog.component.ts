import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.css'],
  imports: [CommonModule]

})
export class OrderDetailsDialogComponent implements OnInit {
  orderDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public order: any,
    private dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.http.get<any>(
      `https://localhost:7183/api/orders/details/${this.order.orderId}`,
      this.authService.getAuthHeaders()
    ).subscribe(details => {
      this.orderDetails = details;
    });
  }


  acceptOrder() {
  const confirmed = window.confirm("ნამდვილად გსურთ შეკვეთის დადასტურება?");
  if (!confirmed) return;

  this.http.post(
    `https://localhost:7183/api/orders/acceptOrder/${this.order.orderId}`,
    {},
    this.authService.getAuthHeaders()
  ).subscribe({
    next: () => {
      this.dialogRef.close(true);
      alert("შეკვეთა დადასტურებულია და მომხმარებელს გაეგზავნა შეტყობინება!");
    },
    error: (err) => {
      console.error("Error accepting order:", err);
      alert("შეკვეთის დადასტურება ვერ მოხერხდა. სცადეთ თავიდან.");
    }
  });
}


  rejectOrder() {
    const confirmed = window.confirm("ნამდვილად გსურთ შეკვეთის გაუქმება? გაუქმებამდე დაუკავშირდით მომხმარებელს");
    if (!confirmed) return;

    this.http.post(
      `https://localhost:7183/api/orders/rejectOrder/${this.order.orderId}`,
      {},
      this.authService.getAuthHeaders()
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
        alert("შეკვეთა უარყოფილია და მომხმარებელს გაეგზავნა შეტყობინება!");
      },
      error: (err) => {
        console.error("Error rejecting order:", err);
        alert("შეკვეთის გაუქმება ვერ მოხერხდა. სცადეთ თავიდან.");
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
