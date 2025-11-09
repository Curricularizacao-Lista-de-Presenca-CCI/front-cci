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

  mensagemErro: string = 'Não foi possível baixar o relatório.';
  mensagemSucesso: string = 'Relatório Baixado com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('dialogImporteChamada') modalImporteChamadaEl!: ElementRef;
  @ViewChild('dialogDeletarChamadaRef') modalDeletarChamadaEl!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;


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

  ngAfterViewInit(): void {
    if (this.modalImporteChamadaEl) {
      this.modalImporteChamada = new Modal(this.modalImporteChamadaEl.nativeElement);
    }

    if (this.modalDeletarChamadaEl) {
      this.modalDeletarChamada = new Modal(this.modalDeletarChamadaEl.nativeElement);
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

  carregarDadosLogin() {
    const funcionarioString = localStorage.getItem("funcionario");

    if (funcionarioString) {
      try {
        this.funcionarioLogado = JSON.parse(funcionarioString);
        console.log('Dados do Funcionário Logado:', this.funcionarioLogado);

      } catch (e) {
        console.error("Erro ao analisar dados do funcionário no localStorage:", e);
        localStorage.removeItem("funcionario");
      }
    } else {
      console.warn("Nenhuma informação de funcionário encontrada no localStorage.");
    }
  }

  carregarListasDeChamada(idEvento: number) {
    this.listaGeralService.buscarChamada(idEvento).subscribe({
      next: (dados: BuscarEventosCadastradoDTO) => {
        this.dadosEvento = dados;
        console.log(this.dadosEvento);
      },
      error: (err) => {
        console.error('Erro ao buscar listas', err);
      }
    });
  }

  carregarFuncionarios() {
    this.listaChamadaService.buscarFuncionariosAtivos().subscribe({
      next: (dados: FuncionariosAtivosDTO[]) => {
        this.funcionarios = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar funcionários', err);
      }
    });
  }

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

        const toast = new Toast(this.liveToastRefError.nativeElement);
        toast.show();
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
    const toastError = new Toast(this.liveToastRefError.nativeElement);
    const toastSuccess = new Toast(this.liveToastRefSuccess.nativeElement);

    if (this.chamadaForm.invalid) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      toastError.show();
      return;
    }

    const formData = new FormData();

    formData.append('arquivo', this.chamadaForm.get('arquivo')?.value);
    formData.append('local', this.chamadaForm.get('local')?.value);
    formData.append('idFuncionario', this.chamadaForm.get('servidor')?.value);

    this.listaChamadaService.importarChamada(formData).subscribe({
      next: () => {
        console.log('Arquivo enviado com sucesso!');
        toastSuccess.show();
        this.dialogImporteChamada = false;
        this.removerArquivo();
      },
      error: (err) => {
        console.error('Erro ao enviar arquivo', err);
        this.mensagemErro = err.error?.message || 'Erro ao enviar arquivo.';
        toastError.show();
      }
    });
  }


  public baixarRelatorio(idEvento: number): void {

    const toastSucess = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastError = new Toast(this.liveToastRefError.nativeElement);


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
        toastSucess.show();
      },
      error: (err) => {
        console.error('Erro ao baixar o relatório:', err);
        toastError.show();
      }
    });
  }

  carregarListas(idFuncionario: number) {
    this.listaChamadaService.buscarListasDeChamada(idFuncionario).subscribe({
      next: (dados: BuscarEventosCadastradoDTO[]) => {
        this.listas = dados;
        console.log(dados);
      },
      error: (err) => {
        console.error('Erro ao buscar listas', err);
      }
    });
  }

  public deletarChamada(): void {

    const toastSucess = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastError = new Toast(this.liveToastRefError.nativeElement);

    if (!this.idEvento) {
      console.error('ID do evento não encontrado!');
      return;
    }

    this.listaChamadaService.deletarChamada(this.idEvento).subscribe({
      next: () => {
        this.dialogDeletarChamada = false;
        toastSucess.show();
        this.carregarListas(this.funcionarioLogado.id);
        this.mensagemSucesso = 'Chamada deletada com sucesso!';
        console.log('Chamada deletada com sucesso!');
      },
      error: (err) => {
        toastError.show();
        this.mensagemErro = 'Não foi possível deletar a chamada. Verifique os dados';
        console.error('Erro ao finalizar chamada:', err);
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

}
