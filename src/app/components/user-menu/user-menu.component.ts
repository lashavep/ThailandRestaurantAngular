// // user-menu.component.ts
// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';

// @Component({
//   selector: 'app-user-menu',
//   imports: [CommonModule, TranslateModule],
//   templateUrl: './user-menu.component.html',
//   styleUrls: ['./user-menu.component.css'],
//   standalone: true
// })
// export class UserMenuComponent {
//   username: string | null = null;
//   avatar: string | null = null;
//   showMenu = false;

//   constructor(private auth: AuthService, private router: Router) {
//     this.username = this.auth.getUsername();
//   }

//   toggleMenu() {
//     this.showMenu = !this.showMenu;
//   }

//   goToOrders() {
//     this.router.navigate(['/orders']);
//     this.showMenu = false;
//   }

//   logout() {
//     this.auth.logout();
//     this.router.navigate(['/login']);
//   }
// }
