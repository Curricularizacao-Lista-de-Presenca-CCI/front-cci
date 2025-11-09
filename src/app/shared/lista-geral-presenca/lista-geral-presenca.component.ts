import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListaGeralPresencaService } from './service/lista-geral-presenca.service';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { ListaPresencaDTO } from '../models/lista-presenca-dto';
import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { BuscarEventosCadastradoDTO } from '../models/buscar-eventos-cadastrado-dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionariosAtivosDTO } from '../models/funcionarios-ativos-dto';
import { ListaChamadaService } from '../lista-chamada/service/lista-chamada.service';
import { BuscaPresencaService } from '../busca-presenca/service/busca-presenca.service';
import { ColocarPresenca } from '../models/colocar-presenca';

@Component({
  selector: 'app-lista-geral-presenca',
  imports: [NavbarComponent, RouterModule, DatePipe, NgForOf, NgFor, NgIf, FormsModule, ReactiveFormsModule,],
  templateUrl: './lista-geral-presenca.component.html',
  styleUrl: './lista-geral-presenca.component.css'
})
export class ListaGeralPresencaComponent implements OnInit {

  /*----------- Definições das Variáveis -----------*/
  modoEdicaoPresenca: boolean = false;
  termoBusca: string = '';
  alunosOriginais: any[] = [];
  funcionarioLogado: any;
  public idEvento!: number;
  public alunos: ListaPresencaDTO[] = [];
  public alunosEdicao!: ColocarPresenca;
  public dadosEvento!: BuscarEventosCadastradoDTO;
  chamadaForm!: FormGroup;
  presencaForm!: FormGroup;
  funcionarios: FuncionariosAtivosDTO[] = [];
  opcoesAtuacaoFiltrada: any[] = [];
  opcoesAtuacao: any;

  mensagemToast: string = '';
  toastClass: string = '';

  @ViewChild('dialogEdicaoChamadaRef') modalEdicaoChamadaEl!: ElementRef;
  @ViewChild('dialogFinalizarChamadaRef') modalFinalizarChamadaEl!: ElementRef;
  @ViewChild('dialogDeletarChamadaRef') modalDeletarChamadaEl!: ElementRef;
  @ViewChild('liveToastGeneric') liveToastGenericRef!: ElementRef;

  private modalFinalizarChamada: Modal | undefined;
  private modalDeletarChamada: Modal | undefined;
  private modalEditarChamada: Modal | undefined;
  private _dialogFinalizarChamada: boolean = false;
  private _dialogDeletarChamada: boolean = false;
  private _dialogEditarChamada: boolean = false;

  constructor(
    private listaGeralService: ListaGeralPresencaService,
    private listaChamadaService: ListaChamadaService,
    private buscaPresencaService: BuscaPresencaService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chamadaForm = this.formBuilder.group({
      local: ['', [Validators.required]],
      funcionario: [null, [Validators.required]],
      titulo: [null, [Validators.required]]
    });

    this.presencaForm = this.formBuilder.group({
      nomeAluno: [null, [Validators.required]],
      idEvento: [this.idEvento],
      idAluno: [null, [Validators.required]]
    });

    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.idEvento = Number(idDaRota);
    }

    this.carregarListasDeChamada(this.idEvento);
    this.carregarAlunos(this.idEvento);
    this.carregarDadosLogin();
    this.carregarFuncionarios();
  }

  /*----------- Configurações dos Dialogs -----------*/
  ngAfterViewInit(): void {
    if (this.modalFinalizarChamadaEl) {
      this.modalFinalizarChamada = new Modal(this.modalFinalizarChamadaEl.nativeElement);
    }

    if (this.modalEdicaoChamadaEl) {
      this.modalEditarChamada = new Modal(this.modalEdicaoChamadaEl.nativeElement);
    }
  }

  set dialogFinalizarChamada(value: boolean) {
    this._dialogFinalizarChamada = value;
    if (value) {
      this.modalFinalizarChamada?.show();
    } else {
      this.modalFinalizarChamada?.hide();
    }
  }

  get dialogFinalizarChamada(): boolean {
    return this._dialogFinalizarChamada;
  }

  abrirModalChamada() {
    this.dialogFinalizarChamada = true;
  }

  set dialogEditarChamada(value: boolean) {
    this._dialogEditarChamada = value;
    if (value) {
      this.modalEditarChamada?.show();
    } else {
      this.modalEditarChamada?.hide();
    }
  }

  get dialogEditarChamada(): boolean {
    return this._dialogEditarChamada;
  }

  abrirModalEditarChamada() {
    this.dialogEditarChamada = true;

    this.chamadaForm.patchValue({
      titulo: this.dadosEvento.titulo,
      local: this.dadosEvento.local,
      funcionario: this.dadosEvento.idFuncionario
    });

    this.opcoesAtuacaoFiltrada = this.opcoesAtuacao.filter(
      (area: FuncionariosAtivosDTO) => area.nome !== this.dadosEvento.funcionario
    );
  }

  set dialogDeletarChamada(value: boolean) {
    this._dialogDeletarChamada = value;
    if (value) {
      this.modalDeletarChamada?.show();
    } else {
      this.modalDeletarChamada?.hide();
    }
  }

  get dialogDeletarChamada(): boolean {
    return this._dialogDeletarChamada;
  }

  abrirModalDeletarChamada() {
    this.dialogFinalizarChamada = true;
  }

  /*----------- Funções de Editar evento, editar e finalizar Chamada -----------*/
  public EditarChamada(): void {

    const toast = new Toast(this.liveToastGenericRef.nativeElement);

    const dadosAlterados = {
      ...this.dadosEvento,
      local: this.chamadaForm.get('local')?.value,
      funcionario: this.chamadaForm.get('funcionario')?.value,
      titulo: this.chamadaForm.get('titulo')?.value,
    };

    this.listaGeralService.alterarChamada(dadosAlterados, this.idEvento).subscribe({
      next: () => {
        this.mensagemToast = 'Chamada editada com sucesso!';
        toast.show();
        this.toastClass = 'text-bg-success';
        this.carregarListasDeChamada(this.idEvento);
        this.dialogEditarChamada = false;
      },
      error: (err) => {
        this.mensagemToast = 'Não foi possível editar a chamada. Verifique os dados';
        this.toastClass = 'text-bg-danger';
        toast.show();
      }
    });
  }

  public finalizarChamada(): void {
    const toast = new Toast(this.liveToastGenericRef.nativeElement);

    this.listaGeralService.finalizarChamada(this.idEvento).subscribe({
      next: () => {
        this.dialogFinalizarChamada = false;
        this.mensagemToast = 'Chamada finalizada com sucesso!';
        this.router.navigate(['/lista-chamada']);
        toast.show();
      },
      error: (err) => {
        this.mensagemToast = 'Não foi possível finalizar a chamada. Verifique os dados';
        this.toastClass = 'text-bg-danger';
        toast.show();
      }
    });
  }

  prepararEdicao() {
    this.alunosOriginais = JSON.parse(JSON.stringify(this.alunos));
    this.modoEdicaoPresenca = true;
  }

  atualizarStatusPresenca(aluno: any, event: Event): void {
    const toast = new Toast(this.liveToastGenericRef.nativeElement);

    const target = event.target as HTMLInputElement;

    aluno.status = target.checked ? 'Sim' : 'Não';

    const dadosPresenca: ColocarPresenca = {
      nomeAluno: aluno.nomeAluno,
      idEvento: this.idEvento,
      idAluno: aluno.idAluno
    };

    this.buscaPresencaService.registrarPresenca(dadosPresenca).subscribe({
      next: (response) => {
        this.mensagemToast = aluno.status === 'Sim'
          ? `Presença de ${aluno.nomeAluno} marcada!`
          : `Presença de ${aluno.nomeAluno} removida!`;
        this.toastClass = 'text-bg-warning';
        toast.show();
      },
      error: (err) => {
        this.mensagemToast = `Erro ao atualizar presença de ${aluno.nomeAluno}.`;
        this.toastClass = 'text-bg-danger';
        toast.show();
        aluno.status = target.checked ? 'Não' : 'Sim';
      }
    });
  }

  salvarPresencasEditadas() {
    this.modoEdicaoPresenca = false;
  }

  get alunosFiltrados(): ListaPresencaDTO[] {
    if (!this.termoBusca) {
      return this.alunos;
    }

    const termoBuscaLower = this.termoBusca.toLowerCase();

    return this.alunos.filter(aluno => {
      return aluno.nomeAluno.toLowerCase().includes(termoBuscaLower);
    });
  }

  /*----------- Funções de carregar dados -----------*/
  carregarFuncionarios() {
    this.listaChamadaService.buscarFuncionariosAtivos().subscribe({
      next: (dados: FuncionariosAtivosDTO[]) => {
        this.funcionarios = dados;
        this.opcoesAtuacao = this.funcionarios;
      }
    });
  }

  carregarAlunos(idEvento: number) {
    this.listaGeralService.buscarAlunos(idEvento).subscribe({
      next: (dados: ListaPresencaDTO[]) => {
        this.alunos = dados;
      }
    });
  }

  carregarListasDeChamada(idEvento: number) {
    this.listaGeralService.buscarChamada(idEvento).subscribe({
      next: (dados: BuscarEventosCadastradoDTO) => {
        this.dadosEvento = dados;
      }
    });
  }

  carregarDadosLogin() {
    const funcionarioString = localStorage.getItem("funcionario");

    if (funcionarioString) {
      try {
        this.funcionarioLogado = JSON.parse(funcionarioString);
      } catch (e) {
        localStorage.removeItem("funcionario");
      }
    }
  }

  carregarAlunosOriginal() {
    this.modoEdicaoPresenca = false;
    this.carregarAlunos(this.idEvento);
  }

}
