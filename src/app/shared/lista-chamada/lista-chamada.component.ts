import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ListaChamadaService } from './service/lista-chamada.service';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuncionariosAtivosDTO } from '../models/funcionarios-ativos-dto';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-lista-chamada',
  imports: [NavbarComponent, RouterModule, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './lista-chamada.component.html',
  styleUrl: './lista-chamada.component.css'
})
export class ListaChamadaComponent {

  mensagemErro: string = 'Não foi possível baixar o relatório.';
  mensagemSucesso: string = 'Relatório Baixado com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('dialogImporteChamada') modalImporteChamadaEl!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;


  constructor(
    private listaChamadaService: ListaChamadaService,
    private formBuilder: FormBuilder,
  ) { }

  chamadaForm!: FormGroup;
  nomeArquivo: string | null = null;

  funcionarios: FuncionariosAtivosDTO[] = [];

  private modalImporteChamada: Modal | undefined;
  private _dialogImporteChamada: boolean = false;

  ngAfterViewInit(): void {
    if (this.modalImporteChamadaEl) {
      this.modalImporteChamada = new Modal(this.modalImporteChamadaEl.nativeElement);
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

}
