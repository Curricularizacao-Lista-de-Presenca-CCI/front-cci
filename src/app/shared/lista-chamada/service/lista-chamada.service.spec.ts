import { TestBed } from '@angular/core/testing';

import { ListaChamadaService } from './lista-chamada.service';

describe('ListaChamadaService', () => {
  let service: ListaChamadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaChamadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
