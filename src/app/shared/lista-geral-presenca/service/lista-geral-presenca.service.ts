import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListaPresencaDTO } from '../../models/lista-presenca-dto';

@Injectable({
  providedIn: 'root'
})
export class ListaGeralPresencaService {

  public baseApiUrlEvento = "http://localhost:8080/evento";
  public baseApiUrlListaPresenca = "http://localhost:8080/lista-de-presenca";

  constructor(
    private http: HttpClient
  ) { }

  public finalizarChamada(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrlEvento}/finalizar-chamada/${idEvento}`, null);
  }

  public buscarAlunos(idEvento: number): Observable<ListaPresencaDTO[]> {
    return this.http.get<ListaPresencaDTO[]>(`${this.baseApiUrlListaPresenca}/buscar-todos-alunos/${idEvento}`);
  }
}
