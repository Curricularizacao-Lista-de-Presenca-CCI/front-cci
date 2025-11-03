import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Atuacao } from '../../shared/models/atuacao';
import { Funcionario } from '../../shared/models/funcionario';
import { FuncionarioForm } from '../../shared/models/funcionario-form';
import { RegistroServiceService } from '../registro/service/registro-service.service';

@Component({
  selector: 'app-dialog-importe-chamada',
  imports: [],
  templateUrl: './dialog-importe-chamada.component.html',
  styleUrl: './dialog-importe-chamada.component.css'
})
export class DialogImporteChamadaComponent {

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
      alert('CADASTRO REALIZADO COM SUCESSO!');
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

}
