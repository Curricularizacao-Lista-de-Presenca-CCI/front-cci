import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../../../shared/models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class RelacaoServidoresService {

    public baseApiUrl = "http://localhost:8080/funcionario";

  constructor(
    private http: HttpClient
  ) { }

  public buscarListaFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseApiUrl}/buscar-funcionarios`);
  }

  public buscarFuncionario(email: string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseApiUrl}/cadastrar/${email}`);
  }
}
