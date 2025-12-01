import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './components/loader/loader.component';
import { OrderService } from './services/order.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent, RouterOutlet, HeaderComponent,FooterComponent,RouterModule, FormsModule,ReactiveFormsModule,HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'finalproject';

  constructor(public loaderService: LoaderService, private orderService: OrderService) {}
  
  ngOnInit() {
    this.orderService.loadPendingCount();
  }

}
