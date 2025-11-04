import { TestBed } from '@angular/core/testing';

import { ListaGeralPresencaService } from './lista-geral-presenca.service';

describe('ListaGeralPresencaService', () => {
  let service: ListaGeralPresencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaGeralPresencaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
