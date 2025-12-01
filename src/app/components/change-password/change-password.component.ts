import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;
  message = '';
  selectedLanguage: string = 'en';

  countdown: number = 0;
  timer: any;

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('newPassword')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return password === confirm ? null : { passwordsMismatch: true };
    };
  }


  get countdownDisplay(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.passwordsMatchValidator()] });
    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }

  ngOnInit() {
    const savedEmail = sessionStorage.getItem('resetEmail') ?? '';
    if (savedEmail) this.form.patchValue({ email: savedEmail });
  }

  async requestCode() {
    const email = this.form.get('email')?.value ?? '';
    if (!email) {
      this.message = this.translateService.instant('password.EnterEmailFirst');
      return;
    }

    this.isSubmitting = true;
    try {
      await lastValueFrom(this.authService.forgotPassword(email));
      this.message = this.translateService.instant('password.CheckEmailForCode');


      this.startCountdown(180);

    } catch (err) {
      console.error('Forgot error', err);
      this.message = this.translateService.instant('password.FailedToSendCode');
    } finally {
      this.isSubmitting = false;
    }
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.countdown = 0;
      }
    }, 1000);
  }

  resetPassword() {
    if (this.form.invalid) return;
    this.isSubmitting = true;

    const email = this.form.get('email')?.value ?? '';
    const code = this.form.get('code')?.value ?? '';
    const newPassword = this.form.get('newPassword')?.value ?? '';

    this.authService.resetPassword({ email, token: code, newPassword }).subscribe(
      res => {
        this.message = this.translateService.instant('password.ResetSuccess');
      },
      err => {
        this.message = 'Error: ' + (err.error?.message ?? 'Unknown');
      },
      () => this.isSubmitting = false
    );
  }
}
