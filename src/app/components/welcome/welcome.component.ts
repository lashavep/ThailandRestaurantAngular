import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [TranslateModule, CommonModule,RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  selectedLanguage: string = 'en'


  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }
}
