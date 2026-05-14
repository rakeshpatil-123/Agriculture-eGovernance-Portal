import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GenericService } from '../../_service/generic/generic.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { ThemeService } from '../../_service/theme/theme.service';

type ThemeMode = 'light' | 'dark';
type FontSize = 'small' | 'normal' | 'large';

@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule, RouterLink, A11yModule, ThemeToggleComponent],
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit, AfterViewInit, OnDestroy {
  logoPath = 'assets/logo/tripura-agriculture.png';

  isLoggedIn = false;
  private loginSubscription?: Subscription;

  reading = false;
  useBrowserTTS = false;
  private readTimeouts: number[] = [];
  private speechUtterance?: SpeechSynthesisUtterance;

  @ViewChild('srDialog') srDialogRef?: ElementRef<HTMLDivElement>;
  dialogOpen = false;
  previouslyFocused?: Element | null = null;
  screenReaderMode = false;
  liveMessage = '';

  fontSize: FontSize = 'normal';
  currentTheme: ThemeMode = 'light';

  constructor(
    private genericService: GenericService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router,
    private liveAnnouncer: LiveAnnouncer,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.checkToken();

    try {
      this.loginSubscription = this.genericService.getLoginStatus().subscribe((status: boolean) => {
        this.isLoggedIn = !!status;
        this.cdRef.detectChanges();
      });
    } catch {
      // no-op
    }

    this.restoreFontSize();

    try {
      this.themeService.initTheme();
      this.currentTheme = this.themeService.isDarkMode ? 'dark' : 'light';
    } catch {
      this.currentTheme = 'light';
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.stopReading();

    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

    const dialogEl = this.srDialogRef?.nativeElement;
    if (dialogEl) {
      dialogEl.removeEventListener('keydown', this.onDialogKeydownBound);
    }

    document.body.classList.remove('sr-mode');
  }

  private restoreFontSize(): void {
    try {
      const savedFont = localStorage.getItem('site-font-size');
      if (savedFont === 'small' || savedFont === 'large' || savedFont === 'normal') {
        this.fontSize = savedFont;
      } else {
        this.fontSize = 'normal';
      }

      this.applyFontSize(this.fontSize, false);
    } catch {
      this.fontSize = 'normal';
      this.applyFontSize('normal', false);
    }
  }

  toggleTheme(): void {
    try {
      this.themeService.toggleTheme();
      this.currentTheme = this.themeService.isDarkMode ? 'dark' : 'light';

      this.announce(
        this.themeService.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'
      );
    } catch {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(this.currentTheme, true);
    }
  }

  private applyTheme(theme: ThemeMode, persist = true): void {
    this.currentTheme = theme;

    const isDark = theme === 'dark';
    const body = document.body;
    const root = document.documentElement;

    if (isDark) {
      this.renderer.addClass(body, 'theme-dark');
      this.renderer.addClass(root, 'theme-dark');
    } else {
      this.renderer.removeClass(body, 'theme-dark');
      this.renderer.removeClass(root, 'theme-dark');
    }

    this.renderer.setAttribute(root, 'data-theme', theme);

    if (persist) {
      try {
        localStorage.setItem('site-theme', theme);
      } catch {
        // no-op
      }

      this.announce(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    }

    this.cdRef.detectChanges();
  }

  toggleBrowserTTS(): void {
    this.useBrowserTTS = !this.useBrowserTTS;
    this.announce(this.useBrowserTTS ? 'Browser voice enabled' : 'Browser voice disabled');
  }

  readPageContent(): void {
    if (this.reading) return;

    const text = this.getPageTextToRead();
    if (!text) {
      this.liveAnnouncer.announce('No readable content found on this page.', 'polite');
      return;
    }

    this.reading = true;
    const chunks = this.chunkText(text, 900);

    if (this.useBrowserTTS && 'speechSynthesis' in window) {
      this.speakWithBrowserTTS(chunks);
    } else {
      this.announceWithLiveAnnouncer(chunks);
    }
  }

  stopReading(): void {
    this.readTimeouts.forEach((id) => window.clearTimeout(id));
    this.readTimeouts = [];

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // no-op
    }

    this.reading = false;

    try {
      this.liveAnnouncer.announce('Stopped reading.', 'polite');
    } catch {
      // no-op
    }
  }

  private getPageTextToRead(): string {
    const main = document.getElementById('mainContent') || document.querySelector('main');
    const source = main || document.body;
    if (!source) return '';

    let text = (source as HTMLElement).innerText || '';
    text = text.replace(/\s{2,}/g, ' ').trim();

    return text;
  }

  private chunkText(text: string, maxLen = 900): string[] {
    if (text.length <= maxLen) return [text];

    const chunks: string[] = [];
    let remaining = text.trim();

    while (remaining.length > 0) {
      if (remaining.length <= maxLen) {
        chunks.push(remaining.trim());
        break;
      }

      const slice = remaining.slice(0, maxLen);
      const lastPeriod = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('! ')
      );

      if (lastPeriod > Math.floor(maxLen * 0.4)) {
        const chunk = remaining.slice(0, lastPeriod + 1).trim();
        chunks.push(chunk);
        remaining = remaining.slice(lastPeriod + 1).trim();
      } else {
        const chunk = remaining.slice(0, maxLen).trim();
        chunks.push(chunk);
        remaining = remaining.slice(maxLen).trim();
      }
    }

    return chunks;
  }

  private announceWithLiveAnnouncer(chunks: string[]): void {
    try {
      this.liveAnnouncer.announce('Start reading page content.', 'polite');
    } catch {
      // no-op
    }

    let delay = 400;
    const spacing = 900;

    chunks.forEach((chunk, i) => {
      const id = window.setTimeout(() => {
        try {
          this.liveAnnouncer.announce(chunk, 'polite');
        } catch {
          // no-op
        }

        if (i === chunks.length - 1) {
          const endId = window.setTimeout(() => {
            this.reading = false;
            try {
              this.liveAnnouncer.announce('Finished reading page content.', 'polite');
            } catch {
              // no-op
            }
            window.clearTimeout(endId);
          }, 500);

          this.readTimeouts.push(endId);
        }
      }, delay);

      this.readTimeouts.push(id);
      delay += spacing;
    });
  }

  private speakWithBrowserTTS(chunks: string[]): void {
    if (!('speechSynthesis' in window)) {
      this.announceWithLiveAnnouncer(chunks);
      return;
    }

    window.speechSynthesis.cancel();

    const speakNext = (index: number) => {
      if (!this.reading || index >= chunks.length) {
        this.reading = false;
        try {
          this.liveAnnouncer.announce('Finished reading page content.', 'polite');
        } catch {
          // no-op
        }
        return;
      }

      const u = new SpeechSynthesisUtterance(chunks[index]);
      u.rate = 1;
      u.onend = () => speakNext(index + 1);
      u.onerror = () => this.announceWithLiveAnnouncer(chunks.slice(index));

      this.speechUtterance = u;
      window.speechSynthesis.speak(u);
    };

    try {
      this.liveAnnouncer.announce('Start reading page content using browser text to speech.', 'polite');
    } catch {
      // no-op
    }

    speakNext(0);
  }

  checkToken(): void {
    try {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    } catch {
      this.isLoggedIn = false;
    }
  }

  logout(): void {
    this.stopReading();

    try {
      this.genericService.logoutUser();
    } catch {
      // no-op
    }

    try {
      localStorage.removeItem('token');
    } catch {
      // no-op
    }

    this.isLoggedIn = false;

    const redirect = this.getRedirectUrl('/');
    window.location.href = redirect;
  }

  navigateToLogin(): void {
    void this.router.navigateByUrl('/page/login').catch(() => {
      window.location.href = this.getRedirectUrl('/page/login');
    });
  }

  navigateToRegister(): void {
    void this.router.navigateByUrl('/page/registration').catch(() => {
      window.location.href = this.getRedirectUrl('/page/registration');
    });
  }

  private getRedirectUrl(path: string): string {
    if (!path) return '';
    const { origin } = window.location;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    const baseEl = document.querySelector('base');
    const basePath = baseEl?.getAttribute('href')?.replace(/\/$/, '') || '';
    return `${origin}${basePath}${normalized}`;
  }

  openSrDialog(): void {
    this.previouslyFocused = document.activeElement;
    this.dialogOpen = true;
    this.cdRef.detectChanges();

    setTimeout(() => {
      const dialogEl = this.srDialogRef?.nativeElement;
      if (!dialogEl) return;

      const focusable = dialogEl.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
      dialogEl.addEventListener('keydown', this.onDialogKeydownBound);
    }, 0);
  }

  closeSrDialog(): void {
    this.dialogOpen = false;

    const dialogEl = this.srDialogRef?.nativeElement;
    if (dialogEl) {
      dialogEl.removeEventListener('keydown', this.onDialogKeydownBound);
    }

    (this.previouslyFocused as HTMLElement | null)?.focus?.();
    this.previouslyFocused = undefined;
    this.cdRef.detectChanges();
  }

  private onDialogKeydownBound = (ev: KeyboardEvent) => this.onDialogKeydown(ev);

  private onDialogKeydown(ev: KeyboardEvent): void {
    if (!this.dialogOpen) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.closeSrDialog();
      return;
    }

    if (ev.key === 'Tab') {
      const dialogEl = this.srDialogRef?.nativeElement;
      if (!dialogEl) return;

      const focusable = Array.from(
        dialogEl.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));

      if (focusable.length === 0) {
        ev.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!ev.shiftKey && active === last) {
        ev.preventDefault();
        first.focus();
      } else if (ev.shiftKey && active === first) {
        ev.preventDefault();
        last.focus();
      }
    }
  }

  skipToMainContent(): void {
    const main = document.getElementById('mainContent') || document.querySelector('main');
    if (main) {
      (main as HTMLElement).setAttribute('tabindex', '-1');
      (main as HTMLElement).focus();
      this.announce('Skipped to main content');
    } else {
      this.announce('Main content not found');
    }
    this.closeSrDialog();
  }

  announce(msg: string): void {
    this.liveMessage = '';
    this.cdRef.detectChanges();

    setTimeout(() => {
      this.liveMessage = msg;
      this.cdRef.detectChanges();

      setTimeout(() => {
        this.liveMessage = '';
        this.cdRef.detectChanges();
      }, 3500);
    }, 60);
  }

  enableScreenReaderMode(): void {
    this.screenReaderMode = true;
    document.body.classList.add('sr-mode');

    this.liveAnnouncer.announce(
      'Screen reader mode enabled. Use Skip to main content to jump to the page.',
      'polite'
    );

    this.closeSrDialog();
  }

  increaseFont(): void {
    this.applyFontSize('large', true);
  }

  resetFont(): void {
    this.applyFontSize('normal', true);
  }

  decreaseFont(): void {
    this.applyFontSize('small', true);
  }

  applyFontSize(size: FontSize, persist = true): void {
    this.fontSize = size;
    const docEl = document.documentElement;
    this.renderer.removeStyle(docEl, 'font-size');

    let px = '16px';
    if (size === 'small') px = '14px';
    if (size === 'normal') px = '16px';
    if (size === 'large') px = '18px';

    this.renderer.setStyle(docEl, 'font-size', px);

    if (persist) {
      try {
        localStorage.setItem('site-font-size', size);
      } catch {
        // no-op
      }

      this.announce(
        size === 'small'
          ? 'Font size decreased'
          : size === 'large'
          ? 'Font size increased'
          : 'Font size reset to normal'
      );
    }

    this.cdRef.detectChanges();
  }
}
