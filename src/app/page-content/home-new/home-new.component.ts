import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

type HeroSlide = {
  image: string;
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
};

type LandingItem = {
  icon: string;
  title: string;
  description: string;
  shortName?: string;
};

type PartnerLink = {
  name: string;
  url: string;
  image?: string;
  shortName: string;
};

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-new.component.html',
  styleUrl: './home-new.component.scss',
})
export class HomeNewComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSlide = 0;
  loadedSlides: boolean[] = [];
  typedTitle = '';
  typedSubtitle = '';
  titleTypedDone = false;
  subtitleTypedDone = false;
  readonly slideDelay = 1100;
  readonly slideProgressDelay = 4200;
  private slideTimer?: ReturnType<typeof setTimeout>;
  private typeInterval?: ReturnType<typeof setInterval>;
  private typeDelayTimer?: ReturnType<typeof setTimeout>;
  private revealObserver?: IntersectionObserver;
  private isTyping = false;

  readonly slides: HeroSlide[] = [
    {
      image: 'assets/images/green.jpg',
      kicker: 'Tripura Agriculture',
      title: 'Simple Business Approvals',
      subtitle: 'Apply and track agriculture services online.',
      description: 'A faster digital route for agriculture-linked business establishment approvals.',
    },
    {
      image: 'assets/images/second.jpg',
      kicker: 'Single Window Access',
      title: 'One Portal, Every Step',
      subtitle: 'Submit documents and monitor progress clearly.',
      description: 'Reduce office visits with transparent application movement and status updates.',
    },
    {
      image: 'assets/images/temple-main.webp',
      kicker: 'Investor Friendly',
      title: 'Support Local Enterprise',
      subtitle: 'For nurseries, agri-trade, and processing units.',
      description: 'Structured workflows help applicants complete formalities with confidence.',
    },
    {
      image: 'assets/images/temple-mid.jpg',
      kicker: 'Digital Governance',
      title: 'Clear Status, Faster Action',
      subtitle: 'Know pending payments, queries, and approvals.',
      description: 'Departments and applicants stay aligned through a common dashboard.',
    },
  ];

  readonly quickStats = [
    { value: '24x7', label: 'Online Access' },
    { value: '1', label: 'Unified Portal' },
    { value: '100%', label: 'Trackable Flow' },
  ];

  readonly approvalSteps: LandingItem[] = [
    {
      icon: '01',
      title: 'Create Account',
      description: 'Register your business profile with basic applicant details.',
    },
    {
      icon: '02',
      title: 'Choose Service',
      description: 'Select the agriculture approval needed for establishment.',
    },
    {
      icon: '03',
      title: 'Upload Documents',
      description: 'Attach required forms, ownership, layout, and identity files.',
    },
    {
      icon: '04',
      title: 'Pay And Submit',
      description: 'Review the application, pay applicable fees, and submit.',
    },
    {
      icon: '05',
      title: 'Track Application',
      description: 'Respond to queries and download the final NOC or approval online.',
    },
  ];

  readonly services: LandingItem[] = [
    {
      icon: 'eco',
      shortName: 'AG',
      title: 'Agri Business Establishment',
      description: 'Online approval support for agriculture-linked commercial units.',
    },
    {
      icon: 'storefront',
      shortName: 'TR',
      title: 'Agriculture Services',
      description: 'Guided application flow for registered agriculture service activity.',
    },
    {
      icon: 'warehouse',
      shortName: 'WH',
      title: 'Storage And Processing',
      description: 'Document-based approval path for agri storage and processing setup.',
    },
    // {
    //   icon: 'sync',
    //   shortName: 'RN',
    //   title: 'Renewal And Updates',
    //   description: 'Renew, correct, and manage approval records from one dashboard.',
    // },
  ];

  readonly benefits: LandingItem[] = [
    {
      icon: 'apps',
      shortName: 'AP',
      title: 'All approvals in one place',
      description: 'Avoid moving between counters for every agriculture permission.',
    },
    {
      icon: 'monitoring',
      shortName: 'RT',
      title: 'Real-time status tracking',
      description: 'See pending actions, payment status, and department remarks.',
    },
    {
      icon: 'verified_user',
      shortName: 'DR',
      title: 'Secure document repository',
      description: 'Keep reusable documents ready for future applications.',
    },
    {
      icon: 'forum',
      shortName: 'QR',
      title: 'Fast query response',
      description: 'Clarifications are raised and answered through the portal.',
    },
  ];

  readonly partnerLinks: PartnerLink[] = [
    {
      name: 'Tripura Agriculture Department',
      url: 'https://agri.tripura.gov.in/',
      image: 'assets/logo/agriculture-tripura.png',
      shortName: 'TRIPURA',
    },
    {
      name: 'Department of Agriculture and Farmers Welfare',
      url: 'https://agriwelfare.gov.in/',
      image: 'assets/footer/logo-footer/Group780.jpg',
      shortName: 'AGRI',
    },
    {
      name: 'National Single Window System',
      url: 'https://www.nsws.gov.in/',
      shortName: 'NSWS',
    },
    {
      name: 'MyGov',
      url: 'https://www.mygov.in/',
      shortName: 'MYGOV',
    },
    {
      name: 'Make in India',
      url: 'https://www.makeinindia.com/',
      image: 'assets/footer/logo-footer/Make_In_India.jpg',
      shortName: 'MAKE',
    },
    {
      name: 'National Portal of India',
      url: 'https://www.india.gov.in/',
      image: 'assets/footer/logo-footer/MaskGroup15.jpg',
      shortName: 'INDIA',
    },
    {
      name: 'Digital India',
      url: 'https://www.digitalindia.gov.in/',
      shortName: 'DIGITAL',
    },
  ];

  readonly partnerLinkRows = [this.partnerLinks, this.partnerLinks];
  readonly insecticideServices = [
  {
    icon: '01',
    title: 'Grant of License to Manufacture Insecticide',
    description: 'Apply for approval to manufacture insecticide products under the portal.',
  },
  {
    icon: '02',
    title: 'Grant of License to Sell / Stock / Exhibit / Distribution',
    description: 'Apply for sales, stocking, display, and distribution of insecticides.',
  },
  {
    icon: '03',
    title: 'Grant of License for Commercial Pest Control Operations',
    description: 'Submit applications for commercial pest control service authorization.',
  },
  {
    icon: '04',
    title: 'Wholesaler (New)',
    description: 'New wholesaler registration for agriculture-related products and services.',
  },
  {
    icon: '05',
    title: 'Retailer (New)',
    description: 'New retailer approval for insecticide and seed-related business activity.',
  },
  // {
  //   icon: '06',
  //   title: 'Renewal',
  //   description: 'Renew existing licenses and continue uninterrupted compliance online.',
  // },
  {
    icon: '06',
    title: 'Seed License',
    description: 'Apply for seed license permissions through the same digital workflow.',
  },
];

staticServices = [
  {
    name: 'Grant of License to Manufacture Insecticide',
    nocType: 'CFE',
    department: 'Agriculture Department',
    icon: 'manufacturing',
    description: 'License for insecticide manufacturing units to operate as per department guidelines.',
  },
  {
    name: 'Grant of License to Sell / Stock / Exhibit / Distribute Insecticides',
    nocType: 'CFO',
    department: 'Agriculture Department',
    icon: 'store',
    description: 'For retailers, stockists, exhibitors, and distributors dealing with insecticides.',
  },
  {
    name: 'Grant of License for Commercial Pest Control Operations',
    nocType: 'NOC',
    department: 'Agriculture Department',
    icon: 'bug_report',
    description: 'Approval for commercial pest control service providers operating in the state.',
  },
  {
    name: 'Wholesaler (New)',
    nocType: 'CFE',
    department: 'Agriculture Department',
    icon: 'warehouse',
    description: 'New wholesaler registration for insecticide-related business activities.',
  },
  {
    name: 'Retailer (New)',
    nocType: 'CFO',
    department: 'Agriculture Department',
    icon: 'shopping_bag',
    description: 'New retailer license for selling insecticides through approved channels.',
  },
  // {
  //   name: 'Renew',
  //   nocType: 'NOC',
  //   department: 'Agriculture Department',
  //   icon: 'refresh',
  //   description: 'Renewal service for existing agriculture-related licenses and approvals.',
  // },
  {
    name: 'Seed License',
    nocType: 'NOC',
    department: 'Agriculture Department',
    icon: 'agriculture',
    description: 'License application for seed business operations and distribution.',
  },
];

getBadgeClass(type: string): string {
  const t = (type || '').toUpperCase().trim();
  if (t === 'CFE') return 'badge badge-cfe';
  if (t === 'CFO') return 'badge badge-cfo';
  if (t === 'NOC') return 'badge badge-noc';
  return 'badge badge-default';
}
  constructor(
    private readonly router: Router,
    private readonly host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.prepareSlideImages();
    this.startTypewriter();
    this.startSlider();
  }

  ngAfterViewInit(): void {
    const sections = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.scroll-reveal')
    );

    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.16,
      }
    );

    sections.forEach((section) => this.revealObserver?.observe(section));
  }

  ngOnDestroy(): void {
    this.pauseSlider();
    this.clearTypewriter();
    this.revealObserver?.disconnect();
  }

  goToSlide(index: number): void {
    this.setActiveSlide(index);
    this.startSlider();
  }

  nextSlide(): void {
    this.setActiveSlide((this.activeSlide + 1) % this.slides.length);
    this.startSlider();
  }

  previousSlide(): void {
    this.setActiveSlide(
      (this.activeSlide - 1 + this.slides.length) % this.slides.length
    );
    this.startSlider();
  }

  shouldLoadSlide(index: number): boolean {
    return this.loadedSlides[index] === true;
  }

  pauseSlider(): void {
    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
      this.slideTimer = undefined;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/page/login']);
  }

  startSlider(): void {
    if (this.isTyping) {
      return;
    }

    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
    }

    this.slideTimer = setTimeout(() => {
      this.setActiveSlide((this.activeSlide + 1) % this.slides.length);
    }, this.slideDelay);
  }

  private setActiveSlide(index: number): void {
    this.activeSlide = index;
    this.prepareSlideImages();
    this.startTypewriter();
  }

  private prepareSlideImages(): void {
    const previousIndex =
      (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    const nextIndex = (this.activeSlide + 1) % this.slides.length;

    this.loadedSlides = this.slides.map((_, index) =>
      index === this.activeSlide || index === previousIndex || index === nextIndex
    );
  }

  private startTypewriter(): void {
    const slide = this.slides[this.activeSlide];

    this.clearTypewriter();
    this.pauseSlider();
    this.isTyping = true;
    this.typeText(slide.title, (value) => (this.typedTitle = value), 295, () => {
      this.titleTypedDone = true;
      this.typeDelayTimer = setTimeout(() => {
        this.typeText(
          slide.subtitle,
          (value) => (this.typedSubtitle = value),
          38,
          () => {
            this.subtitleTypedDone = true;
            this.isTyping = false;
            this.startSlider();
          }
        );
      }, 260);
    });
  }

  private typeText(
    text: string,
    update: (value: string) => void,
    speed: number,
    done?: () => void
  ): void {
    let index = 0;

    update('');
    this.typeInterval = setInterval(() => {
      index += 1;
      update(text.slice(0, index));

      if (index >= text.length) {
        if (this.typeInterval) {
          clearInterval(this.typeInterval);
          this.typeInterval = undefined;
        }

        done?.();
      }
    }, speed);
  }

  private clearTypewriter(): void {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
      this.typeInterval = undefined;
    }

    if (this.typeDelayTimer) {
      clearTimeout(this.typeDelayTimer);
      this.typeDelayTimer = undefined;
    }

    this.typedTitle = '';
    this.typedSubtitle = '';
    this.titleTypedDone = false;
    this.subtitleTypedDone = false;
    this.isTyping = false;
  }
}
