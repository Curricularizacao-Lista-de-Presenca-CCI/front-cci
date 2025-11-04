import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListaGeralPresencaService } from './service/lista-geral-presenca.service';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-lista-geral-presenca',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './lista-geral-presenca.component.html',
  styleUrl: './lista-geral-presenca.component.css'
})
export class ListaGeralPresencaComponent implements OnInit {

  public idEvento: number = 1; 

  @ViewChild('dialogConfirmacaoRef') modalConfirmacaoEl!: ElementRef;
  mensagemErro: string = 'Não foi possível finalizar a chamada. Verifique os dados';
  mensagemSucesso: string = 'Chamada finalizada com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;

  constructor(
    private listaGeralService: ListaGeralPresencaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.idEvento = Number(idDaRota);
    }
  }

  public finalizarChamada(): void {

    const toastSucess = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastError = new Toast(this.liveToastRefError.nativeElement);

    if (!this.idEvento) {
      console.error('ID do evento não encontrado!');
      return;
    }

    this.listaGeralService.finalizarChamada(1).subscribe({
      next: () => {
        toastSucess.show();
        console.log('Chamada finalizada com sucesso!');
      },
      error: (err) => {
        toastError.show();
        console.error('Erro ao finalizar chamada:', err);
      }
    });
  }

}
