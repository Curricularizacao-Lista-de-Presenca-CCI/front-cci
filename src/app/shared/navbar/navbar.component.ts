import { Component } from '@angular/core';
import { TokenService } from '../service/token.service';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuAtivo = false;

  constructor(private tokenService: TokenService) {}

  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }

  fazerLogout(): void {
    this.tokenService.logout();
  }
  
  fecharMenu() {
    this.menuAtivo = false;
  }
}
