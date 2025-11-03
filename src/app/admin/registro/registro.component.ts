import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { Funcionario } from '../../shared/models/funcionario';
import { RegistroServiceService } from './service/registro-service.service';
import { Atuacao } from '../../shared/models/atuacao';
import { Router } from '@angular/router';
import { FuncionarioForm } from '../../shared/models/funcionario-form';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, NavbarComponent, FormsModule, ReactiveFormsModule, DropdownModule, SelectModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  dialogCadastrar: boolean = false;
  dialogSucesso: boolean = false;
  cadastroForm!: FormGroup;
  cadastrou: boolean = false;

  areasDeAtuacao = Object.keys(Atuacao).filter(key => isNaN(Number(key)));

  constructor(
    private registro: RegistroServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      areaAtuacao: [null, [Validators.required]]
    });
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

  this.registro.cadastrarFuncionario(funcionarioParaEnviar).subscribe({
    next: () => {
      this.dialogSucesso = true;
      this.cadastroForm.reset();
    },
    error: (erro) => {
      console.error('ERRO:', erro);
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

  mostrarDialog() {
    this.dialogCadastrar = true;
  }
}
