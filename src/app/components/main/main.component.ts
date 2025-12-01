import { Component } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [WelcomeComponent, CommonModule, TranslateModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  slides: string[];
  i: number;
  interval: any;
  isLoading: boolean = true;
  selectedLanguage: string = 'en'




  constructor(private translateService: TranslateService) {
    this.i = 0;
    this.slides = [
      'https://img.freepik.com/free-photo/delicious-lobster-gourmet-seafood_23-2151713031.jpg?t=st=1730352424~exp=1730356024~hmac=9cd15c78dd7df30300dd95ecff3511f4384caef6aa0529c93f4d488e4c582027&w=900',
      'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?t=st=1730352436~exp=1730356036~hmac=7a0ad450e59d087c0f20a195952f1b14b9ea556d07021c8f1aa81722abc46cee&w=900',
      'https://img.freepik.com/premium-photo/high-angle-view-fruits-table_1048944-6149862.jpg?w=900',
      'https://img.freepik.com/premium-photo/mediterranean-feast-table-spread-flavors_1280516-29268.jpg?w=900',
      'https://img.freepik.com/premium-photo/assorted-healthy-dishes-covering-frame-with-copy-space-center_878954-13750.jpg?w=900',
      'https://img.freepik.com/premium-photo/plate-food-with-vegetables-meat_1305390-15873.jpg?w=900',
      'https://img.freepik.com/premium-photo/background-food-photo_517312-36716.jpg?w=826',
    ];

    this.translateService.setDefaultLang(this.selectedLanguage)
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang)
  }

  ngOnInit() {

    this.startSlideshow();
  }

  ngOnDestroy() {

    clearInterval(this.interval);
  }

  startSlideshow() {
    this.interval = setInterval(() => {
      this.getNext();
    }, 2500);
  }

  getSlide() {
    return this.slides[this.i];
  }

  getPrev() {
    this.i == 0 ? (this.i = this.slides.length - 1) : this.i--;
  }

  getNext() {
    this.i < this.slides.length - 1 ? this.i++ : (this.i = 0);
  }

}
