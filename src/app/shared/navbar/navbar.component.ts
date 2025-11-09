import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { TokenService } from '../service/token.service';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  menuAtivo = false;
  funcionarioLogado: any;

  @ViewChild('dialogConfirmacaoRef') dialogConfirmarPresencaEl!: ElementRef;
  private modalConfirmacao: Modal | undefined;
  private _dialogConfirmacao: boolean = false;

  constructor(private tokenService: TokenService) {}


  ngOnInit(): void {
    this.carregarDadosLogin();
  }
  

  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }

  fecharMenu() {
    this.menuAtivo = false;
  }

  ngAfterViewInit(): void {
        if (this.dialogConfirmarPresencaEl) {
          this.modalConfirmacao = new Modal(this.dialogConfirmarPresencaEl.nativeElement);
        }
    }
    
    set dialogConfirmacao(value: boolean) {
        this._dialogConfirmacao = value;
        if (value) {
          this.modalConfirmacao?.show();
        } else {
          this.modalConfirmacao?.hide();
        }
    }
  
    get dialogConfirmacao(): boolean {
      return this._dialogConfirmacao;
    }
  
    abrirModalConfirmacao() {
      this.dialogConfirmacao = true;
    }

  fazerLogout(): void {
    this.dialogConfirmacao = false;
    this.tokenService.logout();
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
}
