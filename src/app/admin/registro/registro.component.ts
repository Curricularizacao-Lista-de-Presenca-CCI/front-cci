import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { Funcionario } from '../../shared/models/funcionario';
import { RegistroServiceService } from './service/registro-service.service';
import { Atuacao } from '../../shared/models/atuacao';
import { RouterModule } from '@angular/router';
import { FuncionarioForm } from '../../shared/models/funcionario-form';
import Modal from 'bootstrap/js/dist/modal';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, NavbarComponent, FormsModule, ReactiveFormsModule, DropdownModule, SelectModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @ViewChild('dialogConfirmacaoRef') modalConfirmacaoEl!: ElementRef;
  @ViewChild('dialogSucessoRef') modalSucessoEl!: ElementRef;
  @ViewChild('liveToastGeneric') liveToastGenericRef!: ElementRef;

  mensagemToast: string = '';
  toastClass: string = '';
  toast!: Toast;
  cadastroForm!: FormGroup;
  cadastrou: boolean = false;

  private modalConfirmacao: Modal | undefined;
  private modalSucesso: Modal | undefined;

  private _dialogConfirmacao: boolean = false;
  private _dialogSucesso: boolean = false;
  public opcoesAtuacao = [
    { label: 'Coordenador', value: Atuacao.C },
    { label: 'Professor',   value: Atuacao.P }
  ];

  constructor(
    private registro: RegistroServiceService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      areaAtuacao: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    if (this.modalConfirmacaoEl) {
      this.modalConfirmacao = new Modal(this.modalConfirmacaoEl.nativeElement);
    }
    if (this.modalSucessoEl) {
      this.modalSucesso = new Modal(this.modalSucessoEl.nativeElement);
    }

    if (this.liveToastGenericRef) {
      this.toast = new Toast(this.liveToastGenericRef.nativeElement);
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

  set dialogSucesso(value: boolean) {
    this._dialogSucesso = value;
    if (value) {
      this.modalSucesso?.show();
    } else {
      this.modalSucesso?.hide();
    }
  }
  get dialogSucesso(): boolean {
    return this._dialogSucesso;
  }

  abrirModalConfirmacao() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }
    this.dialogConfirmacao = true;
  }


cadastrar() {
  if (this.cadastroForm.invalid) {
    console.error("Formulário inválido. Preencha todos os campos obrigatórios.");
    this.cadastroForm.markAllAsTouched();
    return;
  }

  const funcionarioParaEnviar: Funcionario = new FuncionarioForm();
  funcionarioParaEnviar.nome = this.cadastroForm.get("nome")?.value;
  funcionarioParaEnviar.email = this.cadastroForm.get("email")?.value;
  funcionarioParaEnviar.senha = this.cadastroForm.get("senha")?.value;
  funcionarioParaEnviar.atuacao = this.cadastroForm.get("areaAtuacao")?.value;;

  this.dialogConfirmacao = false;

  this.registro.cadastrarFuncionario(funcionarioParaEnviar).subscribe({
    next: () => {
      this.dialogSucesso = true;
      this.cadastroForm.reset();
    },
    error: (err) => {
        this.mensagemToast = err.error?.message || 'Erro ao registrar presença.';
        this.toast.show();
    }
  });
} 

  get nome() {
    return this.cadastroForm.get('nome');
  }

  get email() {
    return this.cadastroForm.get('email');
  }

  get senha() {
    return this.cadastroForm.get('senha');
  }

  get atuacao() {
    return this.cadastroForm.get('areaAtuacao');
  }
}
