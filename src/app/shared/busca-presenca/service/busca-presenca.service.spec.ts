import { TestBed } from '@angular/core/testing';

import { BuscaPresencaService } from './busca-presenca.service';

describe('BuscaPresencaService', () => {
  let service: BuscaPresencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscaPresencaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
