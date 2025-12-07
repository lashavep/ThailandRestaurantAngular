// LoginComponent
// გამოიყენება მომხმარებლის ავტორიზაციისთვის.
// AuthService.login() ფუნქცია აგზავნის მოთხოვნას API-ზე (/api/Auth/sign_in)
// და აბრუნებს JWT ტოკენს, რომლითაც ხდება სისტემაში შესვლა.

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  selectedLanguage: string = 'en';

  constructor(
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang(this.selectedLanguage);
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang);
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        localStorage.setItem('token', res.token);

        const role = this.authService.getUserRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        Swal.fire({
          title: 'Wrong credentials',
          icon: 'error'
        });
      }
    });
  }

  onForgotPassword() {
    this.router.navigate(['/change-password']);
  }
}
