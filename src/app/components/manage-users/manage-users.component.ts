import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  styleUrls: ['./manage-users.component.css'],
  templateUrl: './manage-users.component.html'
})

export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private adminService: AdminService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load users', 'error');
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: this.translate.instant('admin.deleteConfirm.title'),
      text: this.translate.instant('admin.deleteConfirm.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('admin.deleteConfirm.confirm'),
      cancelButtonText: this.translate.instant('admin.deleteConfirm.cancel')
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('✔️', this.translate.instant('admin.deleteConfirm.success'), 'success');
            this.ngOnInit();
          },
          error: () => {
            Swal.fire('❌', this.translate.instant('admin.deleteConfirm.error'));
            error: (err: { error: { message: any; }; }) => {
              Swal.fire('❌', err.error?.message || 'Delete failed', 'error');
            }

          }
        });
      }
    });
  }
}
