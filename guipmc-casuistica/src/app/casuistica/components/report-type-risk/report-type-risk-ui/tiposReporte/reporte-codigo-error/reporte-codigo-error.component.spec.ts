import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCodigoErrorComponent } from './reporte-codigo-error.component';

describe('ReporteCodigoErrorComponent', () => {
  let component: ReporteCodigoErrorComponent;
  let fixture: ComponentFixture<ReporteCodigoErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteCodigoErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCodigoErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
