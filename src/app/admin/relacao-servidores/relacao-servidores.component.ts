import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { RelacaoServidoresService } from './service/relacao-servidores.service';
import { Funcionario } from '../../shared/models/funcionario';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-relacao-servidores',
  imports: [NavbarComponent, RouterModule, NgForOf],
  templateUrl: './relacao-servidores.component.html',
  styleUrl: './relacao-servidores.component.css'
})
export class RelacaoServidoresComponent {

  listaFuncionarios: Funcionario[] = [];
  funcionarioSelecionado: Funcionario | null = null;

  constructor(
    private relacaoServidoresService: RelacaoServidoresService,
  ) { }

  ngOnInit() {
    this.carregarlistaFuncionarios();
  }

  carregarlistaFuncionarios() {
    this.relacaoServidoresService.buscarListaFuncionarios().subscribe({
      next: (dados: Funcionario[]) => {
        this.listaFuncionarios = dados;
        console.log(this.listaFuncionarios);
      },
      error: (err) => {
        console.error('Erro ao buscar funcionários', err);
      }
    });
  }

  abrirModalInativar(funcionario: Funcionario) {
    this.funcionarioSelecionado = funcionario;
  }

}
