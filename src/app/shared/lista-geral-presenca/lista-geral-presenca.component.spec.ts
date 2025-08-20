import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGeralPresencaComponent } from './lista-geral-presenca.component';

describe('ListaGeralPresencaComponent', () => {
  let component: ListaGeralPresencaComponent;
  let fixture: ComponentFixture<ListaGeralPresencaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaGeralPresencaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaGeralPresencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
