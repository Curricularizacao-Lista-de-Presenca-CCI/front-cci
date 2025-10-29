import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Atuacao } from '../../shared/models/atuacao';
import { Funcionario } from '../../shared/models/funcionario';
import { FuncionarioForm } from '../../shared/models/funcionario-form';
import { RegistroServiceService } from '../registro/service/registro-service.service';

@Component({
  selector: 'app-relacao-servidores',
  imports: [NavbarComponent, RouterOutlet, RouterModule],
  templateUrl: './relacao-servidores.component.html',
  styleUrl: './relacao-servidores.component.css'
})
export class RelacaoServidoresComponent {

  cadastroForm!: FormGroup;
  cadastrou: boolean = false;

  constructor(
    private relacaoServidoresService: RelacaoServidoresComponent,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
  }


// buscarListaFuncionarios() {

//   this.relacaoServidoresService.buscarListaFuncionarios(funcionarioParaEnviar).subscribe({
//     next: () => {
//       alert('CADASTRO REALIZADO COM SUCESSO!');
//       this.cadastroForm.reset();
//     },
//     error: (erro) => {
//       console.error('ERRO:', erro);
//     }
//   });
// } 

}
