import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImporteChamadaComponent } from './importe-chamada.component';

describe('ImporteChamadaComponent', () => {
  let component: ImporteChamadaComponent;
  let fixture: ComponentFixture<ImporteChamadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImporteChamadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImporteChamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
