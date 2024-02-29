import { TestBed } from '@angular/core/testing';

import { ManzanaService } from './manzana.service';

describe('ManzanaService', () => {
  let service: ManzanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManzanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
