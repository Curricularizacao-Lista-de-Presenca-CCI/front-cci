import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaChamadaService {

      public baseApiUrl = "http://localhost:8080/relatorios";

  constructor(
    private http: HttpClient
  ) { }

  public buscarPDF(idEvento: number): Observable<Blob> {
    return this.http.get(`${this.baseApiUrl}/buscar-pdf/${idEvento}`, {
      responseType: 'blob'
    });
  }
}
