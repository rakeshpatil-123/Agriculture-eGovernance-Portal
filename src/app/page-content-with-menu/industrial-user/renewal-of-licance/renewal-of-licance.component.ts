import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // 1. Import ActivatedRoute
import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/component/table/table.component';
import { GenericService } from '../../../_service/generic/generic.service';

@Component({
  selector: 'app-renewal-of-licance',
  imports: [DynamicTableComponent],
  templateUrl: './renewal-of-licance.component.html',
  styleUrl: './renewal-of-licance.component.scss',
})
export class RenewalOfLicanceComponent implements OnInit {
  renewalData: any[] = [];

  // 2. Inject ActivatedRoute in the constructor
  constructor(
    private apiService: GenericService, 
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.fetchRenewalData();
  }

  columns: TableColumn[] = [
    {
      key: 'id',
      label: 'Application ID',
      type: 'number',
      sortable: true,
      width: '80px',
      format: (value, row) => String(row.application_id),
    },
    {
      key: 'service_name',
      label: 'Service',
      type: 'text',
      sortable: true,
      width: '200px',
    },
    {
      key: 'department_name',
      label: 'Department',
      type: 'text',
      sortable: true,
      width: '200px',
    },
    {
      key: 'application_number',
      label: 'Application No',
      type: 'text',
      sortable: true,
      width: '250px',
    },
    {
      key: 'expiry_date',
      label: 'Expiry Date',
      type: 'date',
      sortable: true,
      width: '150px',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      sortable: true,
      width: '120px',
    },
    {
      key: 'renew',
      label: 'Renewal List',
      type: 'button',
      width: '120px',
      buttonText: 'View',
      buttonColor: 'btn-success',
      onClick: (row) => {
        this.router.navigate(['/dashboard/renewal-list', row.service_id, row.application_id]);
      },
    },
  ];

  fetchRenewalData(): void {
    const serviceIdParam = this.route.snapshot.queryParamMap.get('id');
    
    const payload: any = {};
    if (serviceIdParam) {
      payload.service_id = Number(serviceIdParam); 
    }

    this.apiService
      .getByConditions(payload, 'api/user/get-applications-ready-for-renewal')
      .subscribe({
        next: (res: any) => {
          if (res?.status === 1 && Array.isArray(res.data)) {
            this.renewalData = res.data.map((item: any, index: number) => ({
              ...item,
              id: index + 1,
            }));
          } else {
            this.renewalData = [];
          }
        },
        error: () => {
          this.renewalData = [];
        },
      });
  }
}