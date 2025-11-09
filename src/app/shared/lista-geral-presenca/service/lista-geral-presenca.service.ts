import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaPresencaDTO } from '../../models/lista-presenca-dto';
import { Evento } from '../../models/evento';
import { BuscarEventosCadastradoDTO } from '../../models/buscar-eventos-cadastrado-dto';

@Injectable({
  providedIn: 'root'
})
export class ListaGeralPresencaService {

  public baseApiUrlEvento = "http://localhost:8080/evento";
  public baseApiUrlListaPresenca = "http://localhost:8080/lista-de-presenca";

  constructor(
    private http: HttpClient
  ) { }

  public buscarChamada(idEvento: number): Observable<BuscarEventosCadastradoDTO> {
    return this.http.get<BuscarEventosCadastradoDTO>(`${this.baseApiUrlEvento}/buscar-informacao-chamada/${idEvento}`);
  }

  public finalizarChamada(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrlEvento}/finalizar-chamada/${idEvento}`, null);
  }

  public buscarAlunos(idFuncionario: number): Observable<ListaPresencaDTO[]> {
    return this.http.get<ListaPresencaDTO[]>(`${this.baseApiUrlListaPresenca}/buscar-todos-alunos/${idFuncionario}`);
  }

  public alterarChamada(evento: BuscarEventosCadastradoDTO, idEvento: number): Observable<BuscarEventosCadastradoDTO> {
    return this.http.post<BuscarEventosCadastradoDTO>(`${this.baseApiUrlEvento}/alterar-lista-chamada/${idEvento}`, evento);
  }
}
