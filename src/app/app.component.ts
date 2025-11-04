import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ServidorService } from './shared/service/servidor.service';
import { TokenService } from './shared/service/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'lista-de-presenca';
  public podeCarregar: boolean = false;

  constructor(public router: Router,
    private tokenService: TokenService,
    private servidorService: ServidorService) {

    // localStorage.setItem(
    //   "token",
    //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjbGFyYWpwbWFycXVlc0BnbWFpbC5jb20iLCJpYXQiOjE3NjIyMzEzMjMsImV4cCI6MTc2MjMxNzcyM30.vK9uShkdM8KoZJzLzOKj8KAOh2UFjSQtAbxPDCH0oEw"
    // );
    // this.tokenService.carregarToken();



    this.tokenService.carregarToken();
    const permissoesToken: any[] = this.tokenService.jwtPayload?.permissoes;

    if (this.tokenService.isAccessTokenInvalido()) {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    }
    this.tokenService.carregarToken();
  }
}
