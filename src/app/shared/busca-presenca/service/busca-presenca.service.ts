import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColocarPresenca } from '../../models/colocar-presenca';

@Injectable({
  providedIn: 'root'
})
export class BuscaPresencaService {

    public baseApiUrl = "http://localhost:8080/lista-de-presenca";

  constructor(
    private http: HttpClient
  ) { }

  public registrarPresenca(presencaForm: ColocarPresenca): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/colocar-presenca`, presencaForm);
  }

}
