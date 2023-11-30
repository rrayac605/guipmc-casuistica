import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypeRiskComponent } from './report-type-risk.component';

describe('ReportTypeRiskComponent', () => {
  let component: ReportTypeRiskComponent;
  let fixture: ComponentFixture<ReportTypeRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTypeRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTypeRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
