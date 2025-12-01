import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService, private translate: TranslateService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      phone: ['']
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.adminService.registerUser(this.form.value).subscribe({
        next: () => {
          Swal.fire('✔️', this.translate.instant('admin.add.success'), 'success');
          this.form.reset();
        },
        error: () => {
          Swal.fire('❌', this.translate.instant('admin.add.error'), 'error');
        }
      });
    }
  }
}
