import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  theme$ = this.themeSubject.asObservable();
  
  // Signal for modern usage
  private themeSignal = signal<Theme>('light');
  readonly isDarkMode = computed(() => this.themeSignal() === 'dark');
  
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.loadTheme();
  }

  private loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark');
      }
    }
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    this.themeSignal.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }

  toggleTheme() {
    const currentTheme = this.themeSignal();
    this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }
}
