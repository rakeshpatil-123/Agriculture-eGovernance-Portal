import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'site-theme';
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  get isDarkMode(): boolean {
    return this.themeSubject.value === 'dark';
  }

  initTheme(): void {
    const initial = this.getInitialTheme();
    this.themeSubject.next(initial);
    this.applyTheme(initial);
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.isDarkMode ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.storageKey, theme);
  }

  private getInitialTheme(): ThemeMode {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('theme-dark');
      body.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
      body.classList.remove('theme-dark');
    }

    root.style.colorScheme = theme;
    body.style.colorScheme = theme;
  }
}
