import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericService } from '../../_service/generic/generic.service';

interface ApplicationData {
  slNo: number;
  service: string;
  totalApplicationsReceived: number;
  totalApplicationsProcessed: number;
  processedWithinTimeline: number;
  processedBeyondTimeline: number;
}

interface DistrictOption {
  district_code: string;
  district_name: string;
}

interface ServiceOption {
  id: number;
  service_title_or_description: string;
}

@Component({
  selector: 'app-application-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './application-dashboard.component.html',
  styleUrl: './application-dashboard.component.scss',
})
export class ApplicationDashboardComponent implements OnInit {
  // Filter values (stores the actual IDs to send in payload)
  selectedServiceId: number | null = null;
  selectedDistrictId: string | null = null;

  // Dropdown options
  services: ServiceOption[] = [];
  districts: DistrictOption[] = [];

  // Table data
  applicationData: ApplicationData[] = [];
  isLoading: boolean = false;

  constructor(private apiService: GenericService) {}

  ngOnInit(): void {
    this.loadFilters();
    this.fetchApplicationData();
  }

  /** Load both filter dropdowns in parallel */
  loadFilters(): void {
    const service$ = this.apiService.postPublicApi({}, 'api/services-filter');
    const district$ = this.apiService.postPublicApi({}, 'api/district-filter'); // Adjust endpoint if different

    service$.subscribe({
      next: (res: any) => {
        this.services = res.data || [];
      },
      error: (err) => console.error('Failed to load services:', err),
    });

    district$.subscribe({
      next: (res: any) => {
        this.districts = res.data || [];
      },
      error: (err) => console.error('Failed to load districts:', err),
    });
  }

  /** Fetch dashboard data with current filter payload */
  fetchApplicationData(): void {
    this.isLoading = true;

    const payload = {
      service_id: this.selectedServiceId,
      district_id: this.selectedDistrictId,
    };

    this.apiService.postPublicApi(payload, 'api/application-dashboard').subscribe({
      next: (response: any) => {
        this.applicationData = (response.data || []).map((item: any) => ({
          slNo: item.sl_no,
          service: item.service,
          totalApplicationsReceived: item.total_applications_received,
          totalApplicationsProcessed: item.total_applications_processed,
          processedWithinTimeline: item.processed_within_timeline,
          processedBeyondTimeline: item.processed_beyond_timeline,
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.applicationData = [];
        this.isLoading = false;
      },
    });
  }

  /** Triggered when user clicks Search */
  onSearch(): void {
    this.fetchApplicationData();
  }

  /** Reset all filters and reload unfiltered data */
  onReset(): void {
    this.selectedServiceId = null;
    this.selectedDistrictId = null;
    this.fetchApplicationData();
  }
}