import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacaoServidoresComponent } from './relacao-servidores.component';

describe('RelacaoServidoresComponent', () => {
  let component: RelacaoServidoresComponent;
  let fixture: ComponentFixture<RelacaoServidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelacaoServidoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelacaoServidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
