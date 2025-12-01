import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [MatExpansionModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  readonly panelOpenState = signal(false);
  selectedLanguage: string = 'en'


  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }
}
