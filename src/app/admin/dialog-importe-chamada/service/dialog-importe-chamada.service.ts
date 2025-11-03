import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../../../shared/models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class DialogImporteChamadaService {

  public baseApiUrl = "http://localhost:8080/evento";

  constructor(
    private http: HttpClient
  ) { }

  public importarChamada(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/enviar-arquivo`, formData);
  }
}
