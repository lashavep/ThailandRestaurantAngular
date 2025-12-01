import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  imports: [CommonModule]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

  get hasError() {
    return this.loaderService.hasError;
  }
}
