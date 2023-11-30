import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaUXComponent } from './prueba-ux.component';

describe('PruebaUXComponent', () => {
  let component: PruebaUXComponent;
  let fixture: ComponentFixture<PruebaUXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruebaUXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaUXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
