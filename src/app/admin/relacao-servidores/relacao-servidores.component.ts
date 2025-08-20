import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-relacao-servidores',
  imports: [NavbarComponent, RouterOutlet, RouterModule],
  templateUrl: './relacao-servidores.component.html',
  styleUrl: './relacao-servidores.component.css'
})
export class RelacaoServidoresComponent {

}
