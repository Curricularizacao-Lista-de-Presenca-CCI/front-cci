import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { RelacaoServidoresService } from './service/relacao-servidores.service';
import { Funcionario } from '../../shared/models/funcionario';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import Modal from 'bootstrap/js/dist/modal';
import { Atuacao } from '../../shared/models/atuacao';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Toast from 'bootstrap/js/dist/toast';
import { InativarServidorForm } from '../../shared/models/inativar-servidor-form';

@Component({
  selector: 'app-relacao-servidores',
  imports: [NavbarComponent, RouterModule, NgForOf, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './relacao-servidores.component.html',
  styleUrl: './relacao-servidores.component.css'
})
export class RelacaoServidoresComponent {

  @ViewChild('dialogaAlterarDados') modalAlterarDadosEl!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;

  mensagemSucesso: string = 'Edição realizada com sucesso!';
  mensagemErro: string = 'Erro ao editar Servidor!';

  listaFuncionarios: Funcionario[] = [];
  funcionarioSelecionado!: Funcionario;
  termoBusca: string = '';

  private modalAlterarDados: Modal | undefined;
  private _dialogAlterarDados: boolean = false;

  alteracaoForm!: FormGroup;
  inativarForm!: FormGroup;

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

    this.inativarForm = this.formbuilder.group({
      idFuncionario: ['', Validators.required],
      statusFuncionario: ['', [Validators.required]],
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

  inativarServidor() {

    if (!this.funcionarioSelecionado) {
      console.error('Nenhum funcionário selecionado para inativar/ativar.');
      return;
    }

    const toastSucesso = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastErro = new Toast(this.liveToastRefError.nativeElement);

    const novoStatus = !this.funcionarioSelecionado.ativo;

    const dadosInativar: InativarServidorForm = {
      idFuncionario: this.funcionarioSelecionado.id,
      statusFuncionario: novoStatus,
    };

    this.mensagemSucesso = novoStatus
      ? 'Servidor ativado com sucesso!'
      : 'Servidor inativado com sucesso!';

    this.relacaoServidoresService.inativarFuncionario(dadosInativar).subscribe({
      next: (resposta) => {
        console.log(resposta);
        toastSucesso.show();
        this.carregarlistaFuncionarios();
      },
      error: (err) => {
        this.mensagemErro = novoStatus
          ? 'Erro ao ativar Servidor!'
          : 'Erro ao inativar Servidor!';
        toastErro.show();
        console.error('Erro ao alternar status do servidor', err);
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

  get listaFuncionariosFiltrada(): Funcionario[] {
    if (!this.termoBusca) {
        return this.listaFuncionarios; // Retorna a lista completa se não houver termo de busca
    }

    const termoBuscaLower = this.termoBusca.toLowerCase();

    return this.listaFuncionarios.filter(funcionario => {
        // Verifica se o nome do funcionário (em minúsculas) inclui o termo de busca (em minúsculas)
        return funcionario.nome.toLowerCase().includes(termoBuscaLower);
    });
}
}
