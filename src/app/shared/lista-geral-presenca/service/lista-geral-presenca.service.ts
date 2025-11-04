import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaGeralPresencaService {

  public baseApiUrlEvento = "http://localhost:8080/evento";

  constructor(
    private http: HttpClient
  ) { }

  public finalizarChamada(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrlEvento}/finalizar-chamada/${idEvento}`, null);
  }
}
