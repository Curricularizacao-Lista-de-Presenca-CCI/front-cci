import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';

interface AreaAtuacao {
  name: string;
  code: string;
}

@Component({
  selector: 'app-registro',
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, DropdownModule, SelectModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formGroup!: FormGroup;
  areaAtuacao: AreaAtuacao[] = [];
  selectedCity: any;
      
  ngOnInit() {
    this.areaAtuacao = [
      { name: 'Coordenacao', code: 'C' },
      { name: 'Servidor', code: 'S' }
    ];

    this.formGroup = new FormGroup({
      selectedCity: new FormControl<AreaAtuacao | null>(null)
    });
  }
}
