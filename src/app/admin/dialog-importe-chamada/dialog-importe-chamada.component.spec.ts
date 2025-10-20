import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImporteChamadaComponent } from './dialog-importe-chamada.component';

describe('DialogImporteChamadaComponent', () => {
  let component: DialogImporteChamadaComponent;
  let fixture: ComponentFixture<DialogImporteChamadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogImporteChamadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogImporteChamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
