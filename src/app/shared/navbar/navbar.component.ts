import { Component } from '@angular/core';
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

  constructor() {}

  toggleMenu() {
    this.menuAtivo = !this.menuAtivo;
  }

  fecharMenu() {
    this.menuAtivo = false;
  }
  
  fazerLogout(): void {
  }
}
