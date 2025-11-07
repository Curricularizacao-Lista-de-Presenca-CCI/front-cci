import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { RelacaoServidoresService } from './service/relacao-servidores.service';
import { Funcionario } from '../../shared/models/funcionario';
import { NgFor, NgForOf } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import { Atuacao } from '../../shared/models/atuacao';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-relacao-servidores',
  imports: [NavbarComponent, RouterModule, NgForOf, FormsModule, ReactiveFormsModule],
  templateUrl: './relacao-servidores.component.html',
  styleUrl: './relacao-servidores.component.css'
})
export class RelacaoServidoresComponent {

  @ViewChild('dialogaAlterarDados') modalAlterarDadosEl!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;

  mensagemSucesso: string = 'Presença registrada com sucesso!';
  mensagemErro: string = 'Erro ao registrar Presença, confira os dados digitados!';

  listaFuncionarios: Funcionario[] = [];
  funcionarioSelecionado: Funcionario | null = null;

  private modalAlterarDados: Modal | undefined;
  private _dialogAlterarDados: boolean = false;

  alteracaoForm!: FormGroup;

    public opcoesAtuacao = [
    { label: 'Coordenador', value: Atuacao.C },
    { label: 'Professor', value: Atuacao.P }
  ];

  opcoesAtuacaoFiltrada: any[] = [];


  constructor(
    private relacaoServidoresService: RelacaoServidoresService,
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.carregarlistaFuncionarios();

    this.alteracaoForm = this.formbuilder.group({
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        areaAtuacao: ['', Validators.required],
        statusServidor: [true]
    });
  }

  ngAfterViewInit(): void {
      if (this.modalAlterarDadosEl) {
        this.modalAlterarDados = new Modal(this.modalAlterarDadosEl.nativeElement);
      }
    }
  
    set dialogImporteChamada(value: boolean) {
      this._dialogAlterarDados = value;
      if (value) {
        this.modalAlterarDados?.show();
      } else {
        this.modalAlterarDados?.hide();
      }
    }
  
    get dialogImporteChamada(): boolean {
      return this._dialogAlterarDados;
    }
  
    abrirModalAlterarFuncionario(funcionario: Funcionario) {
      this.dialogImporteChamada = true;
      this.funcionarioSelecionado = funcionario;

      this.alteracaoForm.patchValue({
        nome: funcionario.nome,
        email: funcionario.email,
        areaAtuacao: funcionario.atuacao,
        statusServidor: true
    });

    this.opcoesAtuacaoFiltrada = this.opcoesAtuacao.filter(
        area => area.value !== funcionario.atuacao
    );
    }

    enviarAlteracoes() {
    if (this.alteracaoForm.invalid || !this.funcionarioSelecionado) {
        console.error('Formulário inválido ou funcionário não selecionado.');
        return;
    }

    const dadosAlterados = {
        ...this.funcionarioSelecionado,
        nome: this.alteracaoForm.get('nome')?.value,
        email: this.alteracaoForm.get('email')?.value,
        atuacao: this.alteracaoForm.get('areaAtuacao')?.value,
        statusServidor: true
    };

    const toastSucesso = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastErro = new Toast(this.liveToastRefError.nativeElement);

    this.relacaoServidoresService.editarFuncionario(dadosAlterados, this.funcionarioSelecionado.id).subscribe({
        next: (resposta) => {
            console.log('Servidor alterado com sucesso:', resposta);
            this.dialogImporteChamada = false;
            toastSucesso.show();
            this.carregarlistaFuncionarios();
        },
        error: (err) => {
            toastErro.show();
            console.error('Erro ao alterar servidor', err);
        }
    });
  }

  carregarlistaFuncionarios() {
    this.relacaoServidoresService.buscarListaFuncionarios().subscribe({
      next: (dados: Funcionario[]) => {
        this.listaFuncionarios = dados;
        console.log(this.listaFuncionarios);
      },
      error: (err) => {
        console.error('Erro ao buscar funcionários', err);
      }
    });
  }

  abrirModalInativar(funcionario: Funcionario) {
    this.funcionarioSelecionado = funcionario;
  }

}
