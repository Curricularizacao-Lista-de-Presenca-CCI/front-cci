import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ListaChamadaService } from './service/lista-chamada.service';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuncionariosAtivosDTO } from '../models/funcionarios-ativos-dto';
import { NgFor, NgIf } from '@angular/common';
import { BuscarEventosCadastradoDTO } from '../models/buscar-eventos-cadastrado-dto';
import { ListaGeralPresencaService } from '../lista-geral-presenca/service/lista-geral-presenca.service';

@Component({
  selector: 'app-lista-chamada',
  imports: [NavbarComponent, RouterModule, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './lista-chamada.component.html',
  styleUrl: './lista-chamada.component.css'
})
export class ListaChamadaComponent {

  /*----------- Definições das Variáveis -----------*/
  mensagemToast: string = '';
  toastClass: string = '';

  @ViewChild('dialogImporteChamada') modalImporteChamadaEl!: ElementRef;
  @ViewChild('dialogDeletarChamadaRef') modalDeletarChamadaEl!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;
  @ViewChild('liveToastGeneric') liveToastGenericRef!: ElementRef;
  toast!: Toast;

  constructor(
    private listaChamadaService: ListaChamadaService,
    private formBuilder: FormBuilder,
    private listaGeralService: ListaGeralPresencaService,
  ) { }

  funcionarioLogado: any;
  idEvento!: number;
  eventoSelecionado!: BuscarEventosCadastradoDTO;
  chamadaForm!: FormGroup;
  nomeArquivo: string | null = null;
  private modalDeletarChamada: Modal | undefined;
  private _dialogDeletarChamada: boolean = false;
  public dadosEvento!: BuscarEventosCadastradoDTO;

  funcionarios: FuncionariosAtivosDTO[] = [];
  listas: BuscarEventosCadastradoDTO[] = [];
  termoBusca: string = '';

  private modalImporteChamada: Modal | undefined;
  private _dialogImporteChamada: boolean = false;

  ngOnInit() {
    this.chamadaForm = this.formBuilder.group({
      arquivo: [null, [Validators.required]],
      local: ['', [Validators.required]],
      servidor: [null, [Validators.required]],
    });
    this.carregarFuncionarios();
    this.carregarDadosLogin();
    this.carregarListas(this.funcionarioLogado.id);
    this.carregarListasDeChamada(this.idEvento);
  }

  /*----------- Configurações dos Dialogs -----------*/
  ngAfterViewInit(): void {
    if (this.modalImporteChamadaEl) {
      this.modalImporteChamada = new Modal(this.modalImporteChamadaEl.nativeElement);
    }

    if (this.modalDeletarChamadaEl) {
      this.modalDeletarChamada = new Modal(this.modalDeletarChamadaEl.nativeElement);
    }

    if (this.liveToastGenericRef) {
      this.toast = new Toast(this.liveToastGenericRef.nativeElement);
    }
  }

  set dialogImporteChamada(value: boolean) {
    this._dialogImporteChamada = value;
    if (value) {
      this.modalImporteChamada?.show();
    } else {
      this.modalImporteChamada?.hide();
    }
  }

  get dialogImporteChamada(): boolean {
    return this._dialogImporteChamada;
  }

  abrirModalConfirmacao() {
    this.dialogImporteChamada = true;
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

  abrirModalDeletarChamada(evento: BuscarEventosCadastradoDTO) {
    this.dialogDeletarChamada = true;
    this.eventoSelecionado = evento;
    this.idEvento = evento.idEvento;

  }

  /*----------- Funções de carregar os arquivos, baixar relatório e deletar chamada -----------*/
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension === 'xlsx') {
        this.nomeArquivo = fileName;
        this.chamadaForm.get('arquivo')?.setValue(file);
      } else {
        this.nomeArquivo = 'Arquivo inválido! (Requer .xlsx)';
        this.removerArquivo();
        this.toast.show();
      }
    } else {
      this.nomeArquivo = null;
      this.chamadaForm.get('arquivo')?.setValue(null);
    }
  }

  removerArquivo() {
    this.nomeArquivo = null;
    this.chamadaForm.get('arquivo')?.setValue(null);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  enviarArquivo() {
    if (this.chamadaForm.invalid) {
      this.mensagemToast = 'Preencha todos os campos obrigatórios.';
      this.toast.show();
      return;
    }

    const formData = new FormData();

    formData.append('arquivo', this.chamadaForm.get('arquivo')?.value);
    formData.append('local', this.chamadaForm.get('local')?.value);
    formData.append('idFuncionario', this.chamadaForm.get('servidor')?.value);

    this.listaChamadaService.importarChamada(formData).subscribe({
      next: () => {
        this.removerArquivo();
        this.toastClass = 'text-bg-success';
        this.mensagemToast = 'Relatório Baixado com sucesso!';
        this.toast.show();
        this.dialogImporteChamada = false;
      },
      error: (err) => {
        this.toastClass = 'text-bg-danger';
        this.mensagemToast = err.error?.message || 'Erro ao enviar arquivo.';
        this.toast.show();
      }
    });
  }

  public baixarRelatorio(idEvento: number): void {
    this.listaChamadaService.buscarPDF(idEvento).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', `Relatorio_Evento_${idEvento}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.mensagemToast = 'Relatório baixado com sucesso!';
        this.toastClass = 'text-bg-success';
        this.toast.show();
      },
      error: (err) => {
        this.mensagemToast = err.error?.message || 'Erro ao baixar relatório.';
        this.toast.show();
      }
    });
  }

  public deletarChamada(): void {
    this.listaChamadaService.deletarChamada(this.idEvento).subscribe({
      next: () => {
        this.dialogDeletarChamada = false;
        this.mensagemToast = 'Chamada deletada com sucesso!';
        this.toastClass = 'text-bg-success';
        this.toast.show();
        this.carregarListas(this.funcionarioLogado.id);
      },
      error: (err) => {
        this.toastClass = 'text-bg-danger';
        this.mensagemToast = err.error?.message || 'Erro ao deletar chamada.';
        this.toast.show();
      }
    });
  }

  get listasFiltradas(): BuscarEventosCadastradoDTO[] {
    if (!this.termoBusca) {
      return this.listas;
    }
    const termoBuscaLower = this.termoBusca.toLowerCase();
    return this.listas.filter(lista => {
      return lista.titulo.toLowerCase().includes(termoBuscaLower);
    });
  }

  /*----------- Funções de carregar dados -----------*/
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

  carregarListasDeChamada(idEvento: number) {
    this.listaGeralService.buscarChamada(idEvento).subscribe({
      next: (dados: BuscarEventosCadastradoDTO) => {
        this.dadosEvento = dados;
      }
    });
  }

  carregarFuncionarios() {
    this.listaChamadaService.buscarFuncionariosAtivos().subscribe({
      next: (dados: FuncionariosAtivosDTO[]) => {
        this.funcionarios = dados;
      }
    });
  }

  carregarListas(idFuncionario: number) {
    this.listaChamadaService.buscarListasDeChamada(idFuncionario).subscribe({
      next: (dados: BuscarEventosCadastradoDTO[]) => {
        this.listas = dados;
      }
    });
  }

}
