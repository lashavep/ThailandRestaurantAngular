import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-promote-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  styleUrls: ['./promote-user.component.css'],
  templateUrl: './promote-user.component.html'
})
export class PromoteUserComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService, private translate: TranslateService) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      newRole: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      const { email, newRole } = this.form.value;
      this.adminService.promoteUserByEmail(email, newRole).subscribe({
        next: () => {
          Swal.fire('✔️', this.translate.instant('admin.promote.success'), 'success');
          this.form.reset();
        },
        error: () => {
          Swal.fire('❌', this.translate.instant('admin.promote.error'), 'error');
        }
      });
    }
  }
}
