import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterModule, CommonModule, TranslateModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    menuOpen = false;
    userMenuOpen = false;
    username: string | null = null;
    selectedLanguage: string = 'en';
    isAdmin = false;
    isLoggedIn = false;

    constructor(
        private router: Router,
        public authService: AuthService,
        private themeService: ThemeService,
        private translateService: TranslateService
    ) {
        this.translateService.setDefaultLang(this.selectedLanguage);
        this.authService.username$.subscribe(name => {
            this.username = name;
        });
    }

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.isAdmin = this.authService.getUserRole() === 'Admin';
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    closeMenu() {
        this.menuOpen = false;
    }

    closeUserMenu() {
        this.userMenuOpen = false;
    }

    switchLanguage(lang: string) {
        this.translateService.use(lang);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

       
        if (!target.closest('.user-dropdown')) {
            this.closeUserMenu();
        }


        if (!target.closest('.nav-menu') && !target.closest('.hamburger')) {
            this.closeMenu();
        }
    }

    goToCart() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/cart']);
        } else {
            this.router.navigate(['/login']);
        }
        this.menuOpen = false;
    }

    logout() {
        Swal.fire({
            title: this.translateService.instant('header.confirmLogout'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translateService.instant('header.yesLogout'),
            cancelButtonText: this.translateService.instant('header.cancel'),
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then(result => {
            if (result.isConfirmed) {
                this.authService.logout();
                this.isLoggedIn = false;
                this.isAdmin = false;
                this.router.navigate(['/']);
                Swal.fire({
                    title: 'Logged Out',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }
}
