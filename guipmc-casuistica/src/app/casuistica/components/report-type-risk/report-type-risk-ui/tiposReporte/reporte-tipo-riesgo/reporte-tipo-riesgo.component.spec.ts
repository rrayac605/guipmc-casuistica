import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTipoRiesgoComponent } from './reporte-tipo-riesgo.component';

describe('ReporteTipoRiesgoComponent', () => {
  let component: ReporteTipoRiesgoComponent;
  let fixture: ComponentFixture<ReporteTipoRiesgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTipoRiesgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTipoRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
