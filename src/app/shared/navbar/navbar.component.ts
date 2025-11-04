import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/service/login.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
}
