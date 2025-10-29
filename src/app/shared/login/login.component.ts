import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Funcionario } from '../models/funcionario';
import { LoginService } from './service/login.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Atuacao } from '../models/atuacao';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!: FormGroup;
  enviado: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: ["", [Validators.required]],
      senha: ["", [Validators.required]],
    });
  }

  login() {

  this.enviado = true;

  if (this.formLogin.invalid) {
    return;
  }

  const dadosLogin = this.formLogin.value;

  this.loginService.login(dadosLogin).subscribe({
    next: (funcionarioLogado) => {
      localStorage.setItem("funcionario", JSON.stringify(funcionarioLogado));
      alert('Login bem-sucedido!');
      
      if (funcionarioLogado.atuacao == Atuacao.COORDENADOR) {
        this.router.navigate(['/admin']);
      } else if (funcionarioLogado.atuacao == Atuacao.PROFESSOR) {
        this.router.navigate(['/lista-chamada']);
      }
    },
    error: (err) => {
      console.error("Erro no login:", err);
      alert("Login falhou. Verifique seu email e senha.");
    }
  });
}

  get email () {
    return this.formLogin.get("email");
  }

  get senha () {
    return this.formLogin.get("senha");
  }

  get areaAtuacao () {
    return this.formLogin.get("areaAtuacao");
  }

}
