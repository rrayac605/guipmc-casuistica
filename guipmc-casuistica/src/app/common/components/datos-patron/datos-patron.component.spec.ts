import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPatronComponent } from './datos-patron.component';

describe('DatosPatronComponent', () => {
  let component: DatosPatronComponent;
  let fixture: ComponentFixture<DatosPatronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPatronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPatronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
