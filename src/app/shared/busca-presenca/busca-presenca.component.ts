import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscaPresencaService } from './service/busca-presenca.service';
import { ColocarPresenca } from '../models/colocar-presenca';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListaGeralPresencaService } from '../lista-geral-presenca/service/lista-geral-presenca.service';
import { ListaPresencaDTO } from '../models/lista-presenca-dto';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-busca-presenca',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SelectModule, DropdownModule],
  templateUrl: './busca-presenca.component.html',
  styleUrl: './busca-presenca.component.css'
})
export class BuscaPresencaComponent implements OnInit {

  public idEvento!: number; 
  alunos: ListaPresencaDTO [] = [];
  presencaForm: FormGroup;
  mensagemSucesso: string = 'Presença registrada com sucesso!';
  mensagemErro: string = 'Erro ao registrar Presença, confira os dados digitados!';

  @ViewChild('liveToastSuccess') liveToastRefSuccess!: ElementRef;
  @ViewChild('liveToastError') liveToastRefError!: ElementRef;
  @ViewChild('dialogConfirmarPresenca') dialogConfirmarPresencaEl!: ElementRef;

  private modalConfirmacao: Modal | undefined;
  private _dialogConfirmacao: boolean = false;


  constructor(
    private fb: FormBuilder,
    private presencaService: BuscaPresencaService,
    private listaGeralService: ListaGeralPresencaService,
    private route: ActivatedRoute
  ) {
    this.presencaForm = this.fb.group({
      nomeAluno: [null, Validators.required],
      idEvento: [this.idEvento]
    });
  }

  ngOnInit(): void {
    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.idEvento = Number(idDaRota);
    }
    this.carregarAlunos(this.idEvento);

    console.log(this.idEvento);
  }

  ngAfterViewInit(): void {
      if (this.dialogConfirmarPresencaEl) {
        this.modalConfirmacao = new Modal(this.dialogConfirmarPresencaEl.nativeElement);
      }
  }
  
  set dialogConfirmacao(value: boolean) {
      this._dialogConfirmacao = value;
      if (value) {
        this.modalConfirmacao?.show();
      } else {
        this.modalConfirmacao?.hide();
      }
  }

  get dialogConfirmacao(): boolean {
    return this._dialogConfirmacao;
  }

  abrirModalConfirmacao() {
    if (this.presencaForm.invalid) {
      this.presencaForm.markAllAsTouched();
      return;
    }
    this.dialogConfirmacao = true;
  }

  confirmarPresenca() {
    if (this.presencaForm.invalid) {
      console.error('Nome do aluno faltando.');
      this.presencaForm.markAllAsTouched();
    return;
    }

    const form: ColocarPresenca = {
      idEvento: this.idEvento,
      nomeAluno: this.nomeAlunoControl?.value
    };

    this.dialogConfirmacao = false;

    const toastSucesso = new Toast(this.liveToastRefSuccess.nativeElement);
    const toastErro = new Toast(this.liveToastRefError.nativeElement);

    this.presencaService.registrarPresenca(form).subscribe({
      next: () => {
        console.log('Presença registrada com sucesso!');
        this.presencaForm.reset();
        toastSucesso.show();
      },
      error: (err) => {
        console.error('Erro ao registrar presença', err);
        toastErro.show();
      }
    });
  }

  get nomeAlunoControl() {
    return this.presencaForm.get('nomeAluno');
  }

  get idEventoControl() {
    return this.presencaForm.get('idEvento');
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

}
