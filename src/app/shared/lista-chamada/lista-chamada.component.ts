import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DialogImporteChamadaComponent } from '../../admin/dialog-importe-chamada/dialog-importe-chamada.component';
import { RouterModule } from '@angular/router';
import { ListaChamadaService } from './service/lista-chamada.service';
import Toast from 'bootstrap/js/dist/toast';

@Component({
  selector: 'app-lista-chamada',
  imports: [NavbarComponent, DialogImporteChamadaComponent, RouterModule],
  templateUrl: './lista-chamada.component.html',
  styleUrl: './lista-chamada.component.css'
})
export class ListaChamadaComponent {

  mensagemErro: string = 'Não foi possível baixar o relatório.';
  mensagemSucesso: string = 'Relatório Baixado com sucesso!';

  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;

  constructor(private listaChamadaService: ListaChamadaService) { }

  public baixarRelatorio(idEvento: number): void {

    const toastSucess = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastError = new Toast(this.liveToastRefError.nativeElement);

    this.listaChamadaService.buscarPDF(idEvento).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `Relatorio_Evento_${idEvento}.pdf`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
        toastSucess.show();
      },
      error: (err) => {
        console.error('Erro ao baixar o relatório:', err);
        toastError.show();
      }
    });
  }

}
