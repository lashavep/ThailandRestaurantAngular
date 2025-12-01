import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-promo-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './promo-email.component.html',
  styleUrls: ['./promo-email.component.css']
})
export class PromoEmailComponent {
  promoForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService, private translate: TranslateService) {
    this.promoForm = this.fb.group({
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  sendEmail() {
    if (this.promoForm.valid) {
      const { subject, body } = this.promoForm.value;
      this.adminService.sendPromoEmail(subject, body).subscribe({
        next: () => Swal.fire({ title: this.translate.instant('admin.promo.success'), icon: "success" }),
        error: () => Swal.fire({ title: this.translate.instant('admin.promo.error'), icon: "error" })
      });

    } else {
      Swal.fire({
        title: this.translate.instant('admin.promo.fill'),
        icon: "warning"
      });
    }
  }
}
