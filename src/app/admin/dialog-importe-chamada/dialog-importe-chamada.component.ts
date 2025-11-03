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
  
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  constructor(
    private service: DialogImporteChamadaService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

    ngOnInit() {
    this.chamadaForm = this.formBuilder.group({
      arquivo: [null, [Validators.required]],
      local: ['', [Validators.required]],
      servidor: [1],
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
    if (this.chamadaForm.invalid) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      const toast = new Toast(this.liveToastRefError.nativeElement);
      toast.show();
      return;
    }

    const formData = new FormData();

    formData.append('arquivo', this.chamadaForm.get('arquivo')?.value);
    formData.append('local', this.chamadaForm.get('local')?.value);
    formData.append('idFuncionario', this.chamadaForm.get('servidor')?.value);

    this.service.importarChamada(formData).subscribe({
      next: () => {
        console.log('Arquivo enviado com sucesso!');
        this.removerArquivo();
      },
      error: (err) => {
        console.error('Erro ao enviar arquivo', err);
        this.mensagemErro = err.error?.message || 'Erro ao enviar arquivo.';
        const toast = new Toast(this.liveToastRefError.nativeElement);
        toast.show();
      }
    });
  }

}
