import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionListComponent } from './inspection-list.component';

describe('InspectionListComponent', () => {
  let component: InspectionListComponent;
  let fixture: ComponentFixture<InspectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
