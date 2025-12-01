import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = false; 
      localStorage.setItem('theme', 'light'); 
    }
    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light'); 
    this.updateTheme();
  }

  updateTheme() {
    const theme = this.isDarkMode ? 'dark' : 'light'; 
    document.documentElement.setAttribute('data-theme', theme);
  }
}


