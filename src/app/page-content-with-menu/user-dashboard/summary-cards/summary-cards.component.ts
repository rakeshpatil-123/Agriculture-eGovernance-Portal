import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard-service';
import { MatIconModule } from '@angular/material/icon';

interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  change: any;
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
})
export class SummaryCardsComponent implements OnInit {
  cards: SummaryCard[] = [];
  dashboardData: any = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // Subscribe to the shared observable
    this.dashboardService.dashboardData$.subscribe({
      next: (data: any) => {
        if (data) {
          this.dashboardData = data;
          this.initializeCards();
        }
      },
      error: (error) => {
        console.error('Error fetching dashboard data', error);
      },
    });
  }

  initializeCards(): void {
    if (this.dashboardData) {
      this.cards = [
        {
          title: 'Total Applications',
          value: this.dashboardData.total_applications_for_this_user || 0,
          icon: 'agriculture',
          color: 'forest',
          change: 'All applications'
        },
        {
          title: 'Approved',
          value:
            this.dashboardData.total_count_approved_application_in_user || 0,
          icon: 'verified',
          color: 'success',
          change: 'Approved applications'
        },
        {
          title: 'Pending',
          value:
            this.dashboardData.total_count_pending_application_in_user || 0,
          icon: 'pending_actions',
          color: 'warning',
          change: 'Pending Applications'
        },
        {
          title: 'Rejected Applications',
          value:
            this.dashboardData.total_count_rejected_application_in_user || 0,
          icon: 'highlight_off',
          color: 'danger',
          change: 'Rejected Applications'
        }
      ];
    }
  }
}
