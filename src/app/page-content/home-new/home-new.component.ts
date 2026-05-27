import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class HomeNewComponent implements OnInit, OnDestroy {
  activeSlide = 0;
  private slideTimer?: ReturnType<typeof setInterval>;

  readonly slides: HeroSlide[] = [
    {
      image: 'assets/images/green.jpg',
      kicker: 'Tripura Agriculture',
      title: 'Business Approval Made Simple',
      subtitle: 'Apply, track, and manage agriculture approvals online.',
      description: 'A faster digital route for agriculture-linked business establishment approvals.',
    },
    {
      image: 'assets/images/second.jpg',
      kicker: 'Single Window Access',
      title: 'One Portal For Every Step',
      subtitle: 'Submit documents once and monitor progress clearly.',
      description: 'Reduce office visits with transparent application movement and status updates.',
    },
    {
      image: 'assets/images/temple-main.webp',
      kicker: 'Investor Friendly',
      title: 'Support For Local Enterprise',
      subtitle: 'Built for nurseries, agri-trade, processing, and services.',
      description: 'Structured workflows help applicants complete formalities with confidence.',
    },
    {
      image: 'assets/images/temple-mid.jpg',
      kicker: 'Digital Governance',
      title: 'Clear Status, Faster Decisions',
      subtitle: 'Know pending actions, payments, and clarifications in time.',
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
      title: 'Track Decision',
      description: 'Respond to queries and download the final approval online.',
    },
  ];

  readonly services: LandingItem[] = [
    {
      icon: 'AG',
      title: 'Agri Business Establishment',
      description: 'Online approval support for agriculture-linked commercial units.',
    },
    {
      icon: 'TR',
      title: 'Trade And Input Services',
      description: 'Guided application flow for registered agriculture service activity.',
    },
    {
      icon: 'WH',
      title: 'Storage And Processing',
      description: 'Document-based approval path for agri storage and processing setup.',
    },
    {
      icon: 'RN',
      title: 'Renewal And Updates',
      description: 'Renew, correct, and manage approval records from one dashboard.',
    },
  ];

  readonly benefits: LandingItem[] = [
    {
      icon: 'OK',
      title: 'All approvals in one place',
      description: 'Avoid moving between counters for every agriculture permission.',
    },
    {
      icon: 'RT',
      title: 'Real-time status tracking',
      description: 'See pending actions, payment status, and department remarks.',
    },
    {
      icon: 'DR',
      title: 'Secure document repository',
      description: 'Keep reusable documents ready for future applications.',
    },
    {
      icon: 'QR',
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

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
    this.startSlider();
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    this.startSlider();
  }

  previousSlide(): void {
    this.activeSlide =
      (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    this.startSlider();
  }

  navigateToLogin(): void {
    this.router.navigate(['/page/login']);
  }

  private startSlider(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }

    this.slideTimer = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    }, 5200);
  }
}
