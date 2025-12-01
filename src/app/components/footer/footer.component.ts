import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  selectedLanguage: string = 'en'

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }

}
