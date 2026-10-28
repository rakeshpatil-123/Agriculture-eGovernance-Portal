import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inspection-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './inspection-dashboard.component.html',
  styleUrl: './inspection-dashboard.component.scss',
})
export class InspectionDashboardComponent {
  // Filter values
  selectedService: string = '';
  selectedDistrict: string = '';

  // Static JSON data - replace with real API data later
  inspectionData = [
    {
      slNo: 1,
      service: 'Service Name 1',
      totalInspections: 150,
      uploadedWithin24Hours: 120,
      uploadedBeyond24Hours: 30
    },
    {
      slNo: 2,
      service: 'Service Name 2',
      totalInspections: 200,
      uploadedWithin24Hours: 180,
      uploadedBeyond24Hours: 20
    },
    {
      slNo: 3,
      service: 'Service Name 3',
      totalInspections: 175,
      uploadedWithin24Hours: 150,
      uploadedBeyond24Hours: 25
    },
    {
      slNo: 4,
      service: 'Service Name 4',
      totalInspections: 130,
      uploadedWithin24Hours: 100,
      uploadedBeyond24Hours: 30
    },
    {
      slNo: 5,
      service: 'Service Name 5',
      totalInspections: 220,
      uploadedWithin24Hours: 200,
      uploadedBeyond24Hours: 20
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
}