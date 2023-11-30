import { TestBed } from '@angular/core/testing';

import { BreadcrumbServiceUxService } from './breadcrumb-service-ux.service';

describe('BreadcrumbServiceUxService', () => {
  let service: BreadcrumbServiceUxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbServiceUxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
