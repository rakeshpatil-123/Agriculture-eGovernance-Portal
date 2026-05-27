import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexAxisChartSeries,
  ApexFill,
  ApexTooltip,
  ApexResponsive,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
};

type ServiceApplicationCount = {
  service_name: string;
  application_count: number;
};

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() dashboardData: any = null;

  chartOptions: Partial<ChartOptions> = this.buildEmptyChartOptions();
  hasData = false;
  services: ServiceApplicationCount[] = [];

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData']) {
      this.initializeChart();
    }
  }

  private getServices(): any[] {
    const rawServices =
      (Array.isArray(this.dashboardData) ? this.dashboardData : null) ??
      this.dashboardData?.application_count_per_service ??
      this.dashboardData?.dashboardData?.application_count_per_service ??
      this.dashboardData?.data?.application_count_per_service;

    return Array.isArray(rawServices) ? rawServices : [];
  }

  initializeChart(): void {
    const services = this.getServices();

    if (!services.length) {
      this.hasData = false;
      this.services = [];
      this.chartOptions = this.buildEmptyChartOptions();
      this.cd.markForCheck();
      return;
    }

    const validServices = services.map((service: any) => ({
      service_name: String(service?.service_name ?? 'Unknown Service'),
      application_count: this.toApplicationCount(service?.application_count),
    }));

    this.services = validServices;
    this.hasData = true;

    const categories = validServices.map((service: any) => service.service_name);
    const seriesData = validServices.map((service: any) => service.application_count);

    const maxValue = Math.max(...seriesData, 0);
    const xMax = maxValue === 0 ? 1 : Math.ceil(maxValue + maxValue * 0.25);

    this.chartOptions = this.buildChartOptions(categories, seriesData, xMax);
    this.cd.markForCheck();
  }

  private toApplicationCount(value: unknown): number {
    const count = Number(value ?? 0);
    return Number.isFinite(count) && count >= 0 ? count : 0;
  }

  private buildChartOptions(
    categories: string[],
    seriesData: number[],
    xMax: number
  ): Partial<ChartOptions> {
    return {
      series: [
        {
          name: 'Applications',
          data: seriesData,
        },
      ],
      chart: {
        type: 'bar',
        height: 420,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        // animations: {
        //   enabled: true,
        //   // easing: 'easeinout',
        //   speed: 900,
        //   animateGradually: {
        //     enabled: true,
        //     delay: 120,
        //   },
        //   dynamicAnimation: {
        //     enabled: true,
        //     speed: 350,
        //   },
        // },
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          barHeight: '48%',
          dataLabels: {
            position: 'right',
          },
        },
      },
      colors: ['#2E7D32'],
      stroke: {
        width: 0,
        lineCap: 'round',
      },
      fill: {
        type: 'solid',
        opacity: 0.9,
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`,
        offsetX: 8,
        style: {
          fontSize: '12px',
          fontWeight: '700',
          colors: ['#334155'],
        },
        background: {
          enabled: false,
        },
      },
      markers: {
        size: 0,
      },
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 4,
        row: {
          colors: ['transparent', 'rgba(46,125,50,0.03)'],
          opacity: 1,
        },
      },
      xaxis: {
        categories,
        min: 0,
        max: xMax,
        tickAmount: xMax <= 5 ? xMax : undefined,
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: 500,
            colors: '#475569',
          },
          formatter: (value: string) => `${Math.round(Number(value) || 0)}`,
        },
        axisBorder: {
          show: true,
          color: '#CBD5E1',
        },
        axisTicks: {
          show: true,
          color: '#CBD5E1',
        },
        title: {
          text: 'Applications',
          style: {
            color: '#64748B',
            fontWeight: 600,
            fontSize: '13px',
          },
        },
      },
      yaxis: {
        labels: {
          maxWidth: 360,
          style: {
            colors: '#475569',
            fontSize: '12px',
          },
        },
        title: {
          text: 'Services',
          style: {
            color: '#64748B',
            fontWeight: 600,
            fontSize: '13px',
          },
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#334155',
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) =>
            `${val} Application${val === 1 ? '' : 's'}`,
        },
      },
      title: {
        text: 'Applications per Service',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: '700',
          color: '#0F172A',
        },
      },
      subtitle: {
        text: 'Agriculture Online Services Applications',
        align: 'left',
        style: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#64748B',
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 350,
            },
            dataLabels: {
              enabled: true,
            },
            yaxis: {
              labels: {
                maxWidth: 260,
              },
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center',
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 320,
            },
            dataLabels: {
              enabled: false,
            },
            yaxis: {
              labels: {
                maxWidth: 220,
              },
            },
          },
        },
      ],
    };
  }

  private buildEmptyChartOptions(): Partial<ChartOptions> {
    return {
      series: [
        {
          name: 'Applications',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 420,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          speed: 700,
        },
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
        },
      },
      colors: ['#2E7D32'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.2,
          opacityTo: 0.02,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 4,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '11px',
            colors: '#475569',
          },
        },
        title: {
          text: 'Services',
          style: {
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 1,
        title: {
          text: 'Applications',
          style: {
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      title: {
        text: 'Applications per Service',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: '700',
          color: '#0F172A',
        },
      },
      subtitle: {
        text: 'No application data available right now',
        align: 'left',
        style: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#64748B',
        },
      },
    };
  }
}
