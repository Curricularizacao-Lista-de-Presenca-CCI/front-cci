import { TestBed } from '@angular/core/testing';

import { DialogImporteChamadaService } from './dialog-importe-chamada.service';

describe('DialogImporteChamadaService', () => {
  let service: DialogImporteChamadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogImporteChamadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
