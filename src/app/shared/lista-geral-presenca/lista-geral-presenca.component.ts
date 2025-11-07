import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListaGeralPresencaService } from './service/lista-geral-presenca.service';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { ListaPresencaDTO } from '../models/lista-presenca-dto';
import { DatePipe, NgFor, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-lista-geral-presenca',
  imports: [NavbarComponent, RouterModule, DatePipe, NgForOf, NgFor, NgIf],
  templateUrl: './lista-geral-presenca.component.html',
  styleUrl: './lista-geral-presenca.component.css'
})
export class ListaGeralPresencaComponent implements OnInit {

  funcionarioLogado: any;
  public idEvento!: number; 
  public alunos: ListaPresencaDTO[] = [];

  mensagemErro: string = 'Não foi possível finalizar a chamada. Verifique os dados';
  mensagemSucesso: string = 'Chamada finalizada com sucesso!';

  @ViewChild('dialogEdicaoChamadaRef') modalEdicaoChamadaEl!: ElementRef;
  @ViewChild('dialogFinalizarChamadaRef') modalFinalizarChamadaEl!: ElementRef;
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;

  private modalFinalizarChamada: Modal | undefined;
  private modalEditarChamada: Modal | undefined;
  private _dialogFinalizarChamada: boolean = false;
  private _dialogEditarChamada: boolean = false;

  constructor(
    private listaGeralService: ListaGeralPresencaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.idEvento = Number(idDaRota);
    }
    this.carregarAlunos(this.idEvento);
    this.carregarDadosLogin();
  }

    ngAfterViewInit(): void {
      if (this.modalFinalizarChamadaEl) {
        this.modalFinalizarChamada = new Modal(this.modalFinalizarChamadaEl.nativeElement);
      }

      if (this.modalEdicaoChamadaEl) {
        this.modalEditarChamada = new Modal(this.modalEdicaoChamadaEl.nativeElement);
      }
    }
  
    set dialogFinalizarChamada(value: boolean) {
      this._dialogFinalizarChamada = value;
      if (value) {
        this.modalFinalizarChamada?.show();
      } else {
        this.modalFinalizarChamada?.hide();
      }
    }
  
    get dialogFinalizarChamada(): boolean {
      return this._dialogFinalizarChamada;
    }
  
    abrirModalChamada() {
      this.dialogFinalizarChamada = true;
    }

    set dialogEditarChamada(value: boolean) {
      this._dialogEditarChamada = value;
      if (value) {
        this.modalEditarChamada?.show();
      } else {
        this.modalEditarChamada?.hide();
      }
    }
  
    get dialogEditarChamada(): boolean {
      return this._dialogEditarChamada;
    }
  
    abrirModalEditarChamada() {
      this.dialogEditarChamada = true;
    }

  public finalizarChamada(): void {

    const toastSucess = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastError = new Toast(this.liveToastRefError.nativeElement);

    if (!this.idEvento) {
      console.error('ID do evento não encontrado!');
      return;
    }

    this.listaGeralService.finalizarChamada(this.idEvento).subscribe({
      next: () => {
        this.dialogFinalizarChamada = false;
        toastSucess.show();
        console.log('Chamada finalizada com sucesso!');
      },
      error: (err) => {
        toastError.show();
        console.error('Erro ao finalizar chamada:', err);
      }
    });
  }

    carregarAlunos(idEvento: number) {
      this.listaGeralService.buscarAlunos(idEvento).subscribe({
        next: (dados: ListaPresencaDTO[]) => {
          this.alunos = dados;
          console.log(this.alunos);
        },
        error: (err) => {
          console.error('Erro ao buscar listas', err);
        }
      });
    }

    carregarDadosLogin() {
    const funcionarioString = localStorage.getItem("funcionario");
    
    if (funcionarioString) {
      try {
        this.funcionarioLogado = JSON.parse(funcionarioString);
        console.log('Dados do Funcionário Logado:', this.funcionarioLogado);
        
      } catch (e) {
        console.error("Erro ao analisar dados do funcionário no localStorage:", e);
        localStorage.removeItem("funcionario");
      }
    } else {
      console.warn("Nenhuma informação de funcionário encontrada no localStorage.");
    }
  }

}
