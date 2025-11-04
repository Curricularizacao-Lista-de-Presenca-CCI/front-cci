import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!: FormGroup;
  enviado: boolean = false;
  mensagemErro: string = 'Ocorreu um erro inesperado. Tente novamente.';
  mensagemSucesso: string = 'Login realizado com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;

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
        console.log(funcionarioLogado);

        const toastElement = this.liveToastRefSuccess.nativeElement;
        const toast = new Toast(toastElement);
        toast.show();
        this.router.navigate(['/lista-chamada']);
      },
      error: (erro) => {
        console.log(erro);
        if (erro.error && erro.error.message) {
          this.mensagemErro = erro.error.message;
        } else {
          this.mensagemErro = 'Ocorreu um erro ao processar sua solicitação.';
        }

        const toastElement = this.liveToastRefError.nativeElement;
        const toast = new Toast(toastElement);
        toast.show();
      }
    });
  }

  get email() {
    return this.formLogin.get("email");
  }

  get senha() {
    return this.formLogin.get("senha");
  }

  get areaAtuacao() {
    return this.formLogin.get("areaAtuacao");
  }

}
