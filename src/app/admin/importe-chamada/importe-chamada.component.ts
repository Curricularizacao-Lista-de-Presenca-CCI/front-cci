import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { DialogImporteChamadaComponent } from '../dialog-importe-chamada/dialog-importe-chamada.component';

@Component({
  selector: 'app-importe-chamada',
  imports: [NavbarComponent, DialogImporteChamadaComponent ],
  templateUrl: './importe-chamada.component.html',
  styleUrl: './importe-chamada.component.css'
})
export class ImporteChamadaComponent {

}
