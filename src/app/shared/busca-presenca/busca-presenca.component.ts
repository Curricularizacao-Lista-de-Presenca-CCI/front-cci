import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscaPresencaService } from './service/busca-presenca.service';
import { ColocarPresenca } from '../models/colocar-presenca';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-busca-presenca',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './busca-presenca.component.html',
  styleUrl: './busca-presenca.component.css'
})
export class BuscaPresencaComponent {

  presencaForm: FormGroup;
  mensagemSucesso: string = 'Presença registrada com sucesso!';
  mensagemErro: string = 'Erro ao registrar Presença, confira os dados digitados!';

  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('dialogConfirmarPresenca') dialogConfirmarPresencaEl!: ElementRef;

  private modalConfirmacao: Modal | undefined;
  private _dialogConfirmacao: boolean = false;


  constructor(
    private fb: FormBuilder,
    private presencaService: BuscaPresencaService,
  ) {
    this.presencaForm = this.fb.group({
      nomeAluno: ['', Validators.required],
      idEvento: [1]
    });
  }

  ngAfterViewInit(): void {
      if (this.dialogConfirmarPresencaEl) {
        this.modalConfirmacao = new Modal(this.dialogConfirmarPresencaEl.nativeElement);
      }
  }
  
  set dialogConfirmacao(value: boolean) {
      this._dialogConfirmacao = value;
      if (value) {
        this.modalConfirmacao?.show();
      } else {
        this.modalConfirmacao?.hide();
      }
  }

  get dialogConfirmacao(): boolean {
    return this._dialogConfirmacao;
  }

  abrirModalConfirmacao() {
    if (this.presencaForm.invalid) {
      this.presencaForm.markAllAsTouched();
      return;
    }
    this.dialogConfirmacao = true;
  }

  confirmarPresenca() {
    if (this.presencaForm.invalid) {
      console.error('Nome do aluno faltando.');
      this.presencaForm.markAllAsTouched();
    return;
    }

    const form: ColocarPresenca = {
      idEvento: this.idEventoControl?.value,
      nomeAluno: this.nomeAlunoControl?.value
    };

    this.dialogConfirmacao = false;

    const toastSucesso = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastErro = new Toast(this.liveToastRefError.nativeElement);

    this.presencaService.registrarPresenca(form).subscribe({
      next: () => {
        console.log('Presença registrada com sucesso!');
        this.presencaForm.reset({ idEvento: 1 });
        toastSucesso.show();
      },
      error: (err) => {
        console.error('Erro ao registrar presença', err);
        toastErro.show();
      }
    });
  }

  get nomeAlunoControl() {
    return this.presencaForm.get('nomeAluno');
  }

  get idEventoControl() {
    return this.presencaForm.get('idEvento');
  }

}
