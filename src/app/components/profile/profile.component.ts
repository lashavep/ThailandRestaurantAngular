// ProfileComponent
// გამოიყენება მომხმარებლის პროფილის ნახვისა და განახლებისთვის.
// AuthService.getProfile() იღებს მონაცემებს API-დან (/api/Users)
// AuthService.updateProfile() კი ანახლებს პროფილის ინფორმაციას.

import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, TranslateModule]
})
export class ProfileComponent implements OnInit {
  profile: any = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    zipcode: '',
    email: '',
    isSubscribedToPromo: false
  };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => this.profile = data,
      error: () => Swal.fire({ title: 'Error', text: 'Failed to load profile', icon: 'error' })
    });
  }

  updateProfile() {
    this.authService.updateProfile(this.profile).subscribe({
      next: (res) => {
        Swal.fire('✔️', res.message || 'Profile updated!', 'success');
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || 'Update Failed';
        Swal.fire('❌', msg, 'error');
      }
    });
  }
  logPromo() {
    console.log('Promo subscription:', this.profile.isSubscribedToPromo);
  }

}
