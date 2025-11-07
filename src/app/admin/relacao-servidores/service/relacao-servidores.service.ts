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

  public editarFuncionario(funcionario: Funcionario, idFuncionario: number): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/alterar-informacoes-servidor/${idFuncionario}`, funcionario);
  }
}
