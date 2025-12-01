import { CommonModule, } from '@angular/common';
import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contact.service';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm!: FormGroup;
  selectedLanguage: string = 'en'

  constructor(private fb: FormBuilder, private translateService: TranslateService, private contactService: ContactService) {
    this.translateService.setDefaultLang(this.selectedLanguage)
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }


  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.contactService.sendContactForm(formData).subscribe({
        next: () => {
          Swal.fire({
            title: "Form submitted successfully!",
            icon: "success"
          });
          this.contactForm.reset();
        },
        error: (err) => {
          Swal.fire({
            title: "Error sending form!",
            text: err.message,
            icon: "error"
          });
        }
      });
    } else {
      Swal.fire({
        title: "Fill blanks to submit!",
        icon: "warning"
      });
    }
  }
}