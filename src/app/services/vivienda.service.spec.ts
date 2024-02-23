import { TestBed } from '@angular/core/testing';

import { ViviendaService } from './vivienda.service';

describe('ViviendaService', () => {
  let service: ViviendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViviendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
