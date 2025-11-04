import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DialogImporteChamadaComponent } from '../../admin/dialog-importe-chamada/dialog-importe-chamada.component';

@Component({
  selector: 'app-lista-chamada',
  imports: [NavbarComponent, DialogImporteChamadaComponent],
  templateUrl: './lista-chamada.component.html',
  styleUrl: './lista-chamada.component.css'
})
export class ListaChamadaComponent {

  

}
