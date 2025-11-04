import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Atuacao } from '../../shared/models/atuacao';
import { Funcionario } from '../../shared/models/funcionario';
import { FuncionarioForm } from '../../shared/models/funcionario-form';
import { RegistroServiceService } from '../registro/service/registro-service.service';
import Toast from 'bootstrap/js/dist/toast';
import { DialogImporteChamadaService } from './service/dialog-importe-chamada.service';
import { CommonModule } from '@angular/common';
import { FuncionariosAtivosDTO } from '../../shared/models/funcionarios-ativos-dto';

@Component({
  selector: 'app-dialog-importe-chamada',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-importe-chamada.component.html',
  styleUrl: './dialog-importe-chamada.component.css'
})
export class DialogImporteChamadaComponent implements OnInit {

  chamadaForm!: FormGroup;
  nomeArquivo: string | null = null;
  mensagemErro = 'Formato de arquivo inválido. Use .xlsx';
  mensagemSucesso = 'Lista de chamada cadastrada com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  funcionarios: FuncionariosAtivosDTO[] = [];

  constructor(
    private service: DialogImporteChamadaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.chamadaForm = this.formBuilder.group({
      arquivo: [null, [Validators.required]],
      local: ['', [Validators.required]],
      servidor: [null, [Validators.required]],
    });
    this.carregarFuncionarios();
  }

  carregarFuncionarios() {
    this.service.buscarFuncionariosAtivos().subscribe({
      next: (dados: FuncionariosAtivosDTO[]) => {
        this.funcionarios = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar funcionários', err);
        this.mensagemErro = 'Erro ao carregar lista de servidores.';
        const toast = new Toast(this.liveToastRefError.nativeElement);
        toast.show();
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

    this.service.importarChamada(formData).subscribe({
      next: () => {
        console.log('Arquivo enviado com sucesso!');
        toastSuccess.show();
        this.removerArquivo();
      },
      error: (err) => {
        console.error('Erro ao enviar arquivo', err);
        this.mensagemErro = err.error?.message || 'Erro ao enviar arquivo.';
        toastError.show();
      }
    });
  }

}
