import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faCloudUploadAlt,
  faFileAlt,
  faGlobe,
  faLandmark,
  faShieldAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';

import { HeaderNewComponent } from './page-template/header-new/header-new.component';
import { LoaderComponent } from './page-template/loader/loader.component';
import { FooterComponent } from './page-template/footer/footer.component';
import { NewNavComponent } from './page-template/new-nav/new-nav.component';
import { MiniFooterComponent } from './page-template/mini-footer/mini-footer.component';
import { LogoFooterComponent } from './page-template/logo-footer/logo-footer.component';
import { HelpFloatingButtonComponent } from './page-template/help-floating-button/help-floating-button.component';
import { HelpSidebarComponent } from './page-template/help-sidebar/help-sidebar.component';

import { LoaderService } from './_service/loader/loader.service';
import { HelpService } from './_service/help/help.service';
import { GenericService } from './_service/generic/generic.service';
import { ThemeService } from './_service/theme/theme.service';

import { PageContentComponent } from './page-content/page-content.component';
import { MarqueeCardsComponent } from './page-content-with-menu/marquee-cards/marquee-cards.component';
import { ImageZoomCardComponent } from './page-content-with-menu/image-zoom-card/image-zoom-card.component';
import { ChooseDestinationComponent } from './page-content-with-menu/choose-destination/choose-destination.component';
import { TestimonialsComponent } from './page-content-with-menu/testimonials/testimonials.component';
import { TripuraTourismLicensingComponent } from './tripura-tourism-licensing/tripura-tourism-licensing.component';
import { TripuraNocDashboardComponent } from './tripura-noc-dashboard/tripura-noc-dashboard.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FontAwesomeModule,
    HeaderNewComponent,
    LoaderComponent,
    FooterComponent,
    NewNavComponent,
    MiniFooterComponent,
    LogoFooterComponent,
    HelpFloatingButtonComponent,
    HelpSidebarComponent,
    PageContentComponent,
    MarqueeCardsComponent,
    ImageZoomCardComponent,
    ChooseDestinationComponent,
    TestimonialsComponent,
    TripuraTourismLicensingComponent,
    TripuraNocDashboardComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  protected title = 'tripura-agriculture-portal';

  showLoader = true;
  isLoggedIn = false;
  currentUrl = '';
  currentPath: any = '';
  helpSidebarOpen = false;
  showOtherComponents = false;

  heroBackgroundImage =
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/Agricultural_field_%28India%2C_2014%29.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org';

  heroStats = [
    { value: '24×7', label: 'Online access' },
    { value: 'Single', label: 'Window flow' },
    { value: 'Fast', label: 'Status updates' },
    { value: 'Mobile', label: 'First design' },
  ];

  trustBadges = [
    'Official Government Portal',
    'Secure Document Handling',
    'Transparent Approval Tracking',
  ];

  quickActions = [
    {
      title: 'Register',
      description: 'Create your profile once.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/farmer.png',
      alt: 'Farmer icon',
    },
    {
      title: 'Apply',
      description: 'Choose approval or license.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/approve.png',
      alt: 'Approve icon',
    },
    {
      title: 'Upload',
      description: 'Submit documents securely.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2022/05/watering-plant.png',
      alt: 'Watering plant icon',
    },
    {
      title: 'Track',
      description: 'Check status anytime.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/loading.png',
      alt: 'Loading icon',
    },
  ];

  serviceModules = [
    {
      tag: 'Farmers',
      title: 'Registration & KYC',
      description: 'One profile for all services.',
      meta: 'Start here',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/farmer.png',
      alt: 'Farmer icon',
    },
    {
      tag: 'Approvals',
      title: 'Business Approval',
      description: 'Single-window clearance flow.',
      meta: 'Fast review',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/approve.png',
      alt: 'Approve icon',
    },
    {
      tag: 'Dealers',
      title: 'Seed / Input License',
      description: 'Dealer registration and licensing.',
      meta: 'License ready',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2021/11/tractor-tractor.png',
      alt: 'Tractor icon',
    },
    {
      tag: 'Subsidy',
      title: 'Scheme Applications',
      description: 'Apply for benefits and support.',
      meta: 'Benefits',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2021/11/plant-growth-plant-growth.png',
      alt: 'Plant growth icon',
    },
    {
      tag: 'Documents',
      title: 'Upload & Verification',
      description: 'Submit files and proofs online.',
      meta: 'Paperless',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2022/05/watering-plant.png',
      alt: 'Watering plant icon',
    },
    {
      tag: 'Tracking',
      title: 'Status & Download',
      description: 'Track progress and download outcomes.',
      meta: 'Live status',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/loading.png',
      alt: 'Loading icon',
    },
  ];

  journeySteps = [
    {
      step: '01',
      title: 'Sign in',
      description: 'Use one secure profile.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/farmer.png',
      alt: 'Farmer icon',
    },
    {
      step: '02',
      title: 'Select service',
      description: 'Choose the right form.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/approve.png',
      alt: 'Approve icon',
    },
    {
      step: '03',
      title: 'Upload docs',
      description: 'Attach required files.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2022/05/watering-plant.png',
      alt: 'Watering plant icon',
    },
    {
      step: '04',
      title: 'Track progress',
      description: 'See stage-wise updates.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2024/01/loading.png',
      alt: 'Loading icon',
    },
    {
      step: '05',
      title: 'Download result',
      description: 'Get approval or certificate.',
      iconSrc: 'https://www.presentations.gov.in/wp-content/uploads/2021/11/plant-growth-plant-growth.png',
      alt: 'Plant growth icon',
    },
  ];

  portalBenefits = [
    {
      title: 'Transparent workflow',
      description: 'Clear stages and decisions.',
      icon: 'shield-alt',
    },
    {
      title: 'Department-ready records',
      description: 'Structured applications save time.',
      icon: 'landmark',
    },
    {
      title: 'Simple document flow',
      description: 'Upload once, review faster.',
      icon: 'file-alt',
    },
    {
      title: 'Clear outcome states',
      description: 'Pending, approved, rejected.',
      icon: 'check-circle',
    },
  ];

  supportItems = [
    {
      title: 'Need help?',
      description: 'Use the help desk for guidance.',
    },
    {
      title: 'Track anytime',
      description: 'Check your application status 24×7.',
    },
    {
      title: 'Light and fast',
      description: 'Built for mobile and low bandwidth.',
    },
  ];

  rawTestimonials: any[] = [
    {
      name: 'Rohan Saha',
      place: 'Agartala, Tripura',
      text: 'The service flow is clear and official.',
    },
    {
      name: 'Amrita Roy',
      place: 'Kolkata, India',
      text: 'It feels like a real government portal.',
    },
    {
      name: 'Vikram Deb',
      place: 'Assam, India',
      text: 'Single-window tracking is easy to follow.',
    },
  ];

  myTestimonials: any[] = this.rawTestimonials.map((t) => ({
    author: t.name,
    text: t.text,
    location: t.place,
  }));

  private destroy$ = new Subject<void>();
  private loaderSubscription!: Subscription;
  private helpSidebarSubscription!: Subscription;

  constructor(
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef,
    private genericService: GenericService,
    private helpService: HelpService,
    private router: Router,
    private library: FaIconLibrary,
    private themeService: ThemeService,
  ) {
    library.addIcons(
      faUserPlus,
      faFileAlt,
      faCloudUploadAlt,
      faCheckCircle,
      faShieldAlt,
      faLandmark,
      faGlobe,
    );
  }

  ngOnInit() {
    this.themeService.initTheme();
    this.currentPath = this.router.url;
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
        this.currentUrl = event.urlAfterRedirects;
        this.cdRef.detectChanges();
      });

    this.loaderSubscription = this.loaderService.getLoaderStatus().subscribe((status) => {
      this.showLoader = status;
      this.cdRef.detectChanges();
    });

    this.genericService.getLoginStatus().pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.isLoggedIn = status;
      this.cdRef.detectChanges();
    });

    this.helpSidebarSubscription = this.helpService.helpSidebar$.subscribe((isOpen) => {
      this.helpSidebarOpen = isOpen;
      this.cdRef.detectChanges();
    });

    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.loaderSubscription?.unsubscribe();
    this.helpSidebarSubscription?.unsubscribe();
  }

  openHelpSidebar() {
    this.helpService.openHelpSidebar();
  }

  closeHelpSidebar() {
    this.helpService.closeHelpSidebar();
  }

  navigateToLogin() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/page/login']);
    }
  }

  goTo(path: string): void {
    window.location.href = this.getRedirectUrl(path);
  }

  getRedirectUrl(path: string): string {
    if (!path) return path;

    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(path)) return path;

    const cleanPath = path.startsWith('/') ? path : '/' + path;
    const baseEl = document.querySelector('base');
    const baseHref = (baseEl?.getAttribute('href') || '').replace(/\/$/, '');

    return `${baseHref}${cleanPath}`;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
