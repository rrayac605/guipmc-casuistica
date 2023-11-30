import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConsecuenciaComponent } from './reporte-consecuencia.component';

describe('ReporteConsecuenciaComponent', () => {
  let component: ReporteConsecuenciaComponent;
  let fixture: ComponentFixture<ReporteConsecuenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteConsecuenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteConsecuenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
