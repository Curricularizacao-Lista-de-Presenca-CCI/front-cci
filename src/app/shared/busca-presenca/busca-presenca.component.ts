import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscaPresencaService } from './service/busca-presenca.service';
import { ColocarPresenca } from '../models/colocar-presenca';
import { CommonModule } from '@angular/common';
import Toast from 'bootstrap/js/dist/toast';
import Modal from 'bootstrap/js/dist/modal';
import { ActivatedRoute, RouterModule } from '@angular/router';
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

  /*----------- Definições das Variáveis -----------*/
  public idEvento!: number;
  public idAluno!: number;
  alunos: ListaPresencaDTO[] = [];
  presencaForm: FormGroup;
  mensagemToast: string = '';
  toastClass: string = '';

  @ViewChild('dialogConfirmarPresenca') dialogConfirmarPresencaEl!: ElementRef;
  @ViewChild('liveToastGeneric') liveToastGenericRef!: ElementRef;
  toast!: Toast;


  private modalConfirmacao: Modal | undefined;
  private _dialogConfirmacao: boolean = false;

  constructor(
    private fb: FormBuilder,
    private presencaService: BuscaPresencaService,
    private route: ActivatedRoute
  ) {
    this.presencaForm = this.fb.group({
      nomeAluno: [null, Validators.required],
      idEvento: [this.idEvento],
      idAluno: [this.idEvento]
    });
  }

  ngOnInit(): void {
    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.idEvento = Number(idDaRota);
    }
    this.carregarAlunos(this.idEvento);
  }

  /*----------- Configurações dos Dialogs -----------*/
  ngAfterViewInit(): void {
    if (this.dialogConfirmarPresencaEl) {
      this.modalConfirmacao = new Modal(this.dialogConfirmarPresencaEl.nativeElement);
    }

    if (this.liveToastGenericRef) {
      this.toast = new Toast(this.liveToastGenericRef.nativeElement);
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

  /*----------- Função de Confirmar Presença -----------*/
  confirmarPresenca() {
    if (this.presencaForm.invalid) {
      this.presencaForm.markAllAsTouched();
      return;
    }

    const alunoSelecionado = this.presencaForm.get('nomeAluno')?.value;

    if (!alunoSelecionado || !alunoSelecionado.idAluno || !alunoSelecionado.nomeAluno) {
      return;
    }

    const form: ColocarPresenca = {
      idEvento: this.idEvento,
      idAluno: alunoSelecionado.idAluno,
      nomeAluno: alunoSelecionado.nomeAluno,
    };

    this.dialogConfirmacao = false;

    this.presencaService.registrarPresenca(form).subscribe({
      next: () => {
        this.carregarAlunos(this.idEvento);
        this.presencaForm.reset();
        this.toastClass = 'text-bg-success';
        this.mensagemToast = 'Presença registrada com sucesso!';
        this.toast.show();
      },
      error: (err) => {
        this.toastClass = 'text-bg-success';
        this.mensagemToast = err.error?.message || 'Erro ao registrar presença.';
        this.toast.show();
      }
    });
  }

  get nomeAlunoControl() {
    return this.presencaForm.get('nomeAluno');
  }

  get idEventoControl() {
    return this.presencaForm.get('idEvento');
  }

  /*----------- Funções de carregar dados -----------*/
  carregarAlunos(idEvento: number) {
    this.presencaService.buscarAlunosFaltantes(idEvento).subscribe({
      next: (dados: ListaPresencaDTO[]) => {
        this.alunos = dados;
      }
    });
  }
}
