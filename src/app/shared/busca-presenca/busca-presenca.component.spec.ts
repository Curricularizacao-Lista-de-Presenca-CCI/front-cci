import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaPresencaComponent } from './busca-presenca.component';

describe('BuscaPresencaComponent', () => {
  let component: BuscaPresencaComponent;
  let fixture: ComponentFixture<BuscaPresencaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaPresencaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaPresencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
