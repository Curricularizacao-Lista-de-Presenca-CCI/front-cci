import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class NavbarComponent {
  menuAtivo = false;

  @ViewChild('dialogConfirmacaoRef') dialogConfirmarPresencaEl!: ElementRef;
  private modalConfirmacao: Modal | undefined;
  private _dialogConfirmacao: boolean = false;

  constructor(private tokenService: TokenService) {}

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
}
