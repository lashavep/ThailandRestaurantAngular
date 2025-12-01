import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { Isignup } from '../../models/signup.model';
import Swal from 'sweetalert2';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  selectedLanguage: string = 'en';
  signupForm: FormGroup;
  showAddressWarning = false;

  constructor(private fb: FormBuilder, private signupService: SignupService, private translateService: TranslateService,private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      zipcode: ['', Validators.required],
      gender: ['', Validators.required,],
      isSubscribedToPromo: [false]
    });
    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  onSubmit() {
    if (this.signupForm.invalid) {
      Swal.fire({
        title: this.translateService.instant('signup.errorTitle'),
        text: this.translateService.instant('signup.passwordMismatch'),
        icon: "error"
      });
      return;
    }

    const formData: Isignup = {
      ...this.signupForm.value,
      firstName: this.capitalize(this.signupForm.value.firstName),
      lastName: this.capitalize(this.signupForm.value.lastName),
    };
    this.signupService.signup(formData).subscribe({
      next: () => {
        Swal.fire({
          title: this.translateService.instant('signup.successTitle'),
          text: this.translateService.instant('signup.successMessage'),
          icon: "success"
        }).then(() => {
      this.router.navigate(['/login']);
    });
      },
      error: (error) => {
        const errorMessage = error?.error?.message || this.translateService.instant('signup.genericError');
        Swal.fire({
          title: this.translateService.instant('signup.errorTitle'),
          text: errorMessage,
          icon: "error"
        });
      }
    });
  }
  capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
