import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionTimelineDashboardComponent } from './inspection-timeline-dashboard.component';

describe('InspectionTimelineDashboardComponent', () => {
  let component: InspectionTimelineDashboardComponent;
  let fixture: ComponentFixture<InspectionTimelineDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionTimelineDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionTimelineDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
