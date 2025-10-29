import { TestBed } from '@angular/core/testing';

import { RelacaoServidoresService } from './relacao-servidores.service';

describe('RelacaoServidoresService', () => {
  let service: RelacaoServidoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelacaoServidoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
