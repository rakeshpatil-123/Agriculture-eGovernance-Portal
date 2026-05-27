import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type CardColor = 'forest' | 'success' | 'warning' | 'danger';

interface SummaryCard {
  title: string;
  value: number;
  percentage: number;
  icon: string;
  color: CardColor;
  change?: string;
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardsComponent implements OnInit, OnChanges {
  @Input() dashboardData: any = {};
  @Input() sidebarCollapsed = false;

  cards: SummaryCard[] = [];

  ngOnInit(): void {
    this.buildCards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData']) {
      this.buildCards();
    }
  }

  private toNumber(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private toPercent(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private buildCards(): void {
    const d = this.dashboardData ?? {};

    this.cards = [
      {
        title: 'Total Applications',
        value: this.toNumber(d.total_applications_for_this_department ?? 0),
        percentage: this.toPercent(d.percentage_total_application ?? 0),
        icon: 'description',
        color: 'forest',
        change: 'All applications',
      },
      {
        title: 'Approved Applications',
        value: this.toNumber(d.total_count_approved_application_in_department ?? 0),
        percentage: this.toPercent(d.percentage_approved_application ?? 0),
        icon: 'verified',
        color: 'success',
        change: 'Approved Applications',
      },
      {
        title: 'Pending',
        value: this.toNumber(d.total_count_pending_application_in_department ?? 0),
        percentage: this.toPercent(d.percentage_pending_application ?? 0),
        icon: 'hourglass_top',
        color: 'warning',
        change: 'Pending applications',
      },
      {
        title: 'Rejected',
        value: this.toNumber(d.total_count_rejected_application_in_department ?? 0),
        percentage: this.toPercent(d.percentage_rejected_application ?? 0),
        icon: 'cancel',
        color: 'danger',
        change: 'Rejected applications',
      },
    ];
  }
}
