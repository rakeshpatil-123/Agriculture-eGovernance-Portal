import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inspection-timeline-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './inspection-timeline-dashboard.component.html',
  styleUrl: './inspection-timeline-dashboard.component.scss',
})
export class InspectionTimelineDashboardComponent {
  // Filter values
  selectedService: string = '';
  selectedDistrict: string = '';

  // Static JSON data - replace with real API data later
  timelineData = [
    {
      slNo: 1,
      service: 'Land Survey Service',
      totalPending: 45,
      conductedWithinTimeline: 30,
      conductedBeyondTimeline: 15,
      totalNumberPending: 60,
      exemptedSelfCert: 10,
      exemptedThirdParty: 5,
      trackId: 'TRK-001'
    },
    {
      slNo: 2,
      service: 'Building Permit',
      totalPending: 80,
      conductedWithinTimeline: 50,
      conductedBeyondTimeline: 30,
      totalNumberPending: 110,
      exemptedSelfCert: 20,
      exemptedThirdParty: 15,
      trackId: 'TRK-002'
    },
    {
      slNo: 3,
      service: 'Environmental Clearance',
      totalPending: 25,
      conductedWithinTimeline: 20,
      conductedBeyondTimeline: 5,
      totalNumberPending: 30,
      exemptedSelfCert: 8,
      exemptedThirdParty: 2,
      trackId: 'TRK-003'
    },
    {
      slNo: 4,
      service: 'Water Connection',
      totalPending: 60,
      conductedWithinTimeline: 40,
      conductedBeyondTimeline: 20,
      totalNumberPending: 80,
      exemptedSelfCert: 15,
      exemptedThirdParty: 10,
      trackId: 'TRK-004'
    },
    {
      slNo: 5,
      service: 'Trade License Renewal',
      totalPending: 35,
      conductedWithinTimeline: 25,
      conductedBeyondTimeline: 10,
      totalNumberPending: 45,
      exemptedSelfCert: 12,
      exemptedThirdParty: 8,
      trackId: 'TRK-005'
    }
  ];

  // Filter options (replace with real data later)
 services = [
  'All Services',
  'Grant of Licence for Commercial Pest Control Operations',
  'Grant of Licence to Manufacture Insecticide',
  'Grant of License to Sell/Stock/Exhibit/Distribute Insecticide',
  'Inclusion of Fertilizer License for Wholesale Applicants',
  'Registration & Renewal of Fertilizer Licence for Retail Applicants',
  'Registration & Renewal of Fertilizer Licence for Wholesale Applicants',
  'Seed Licence'
];
 districts = [
  'All Districts',
  'Dhalai',
  'Gomati',
  'Khowai',
  'North Tripura',
  'Sepahijala',
  'South Tripura',
  'Unakoti',
  'West Tripura'
];

  trackInspection(trackId: string) {
    // Implement the logic to track the inspection based on the provided trackId
    console.log(`Tracking inspection with ID: ${trackId}`);
    // You can navigate to a detailed view or perform any other action here
  }
}