import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lista } from '../../../shared/models/lista';
import { Funcionario } from '../../../shared/models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class RegistroServiceService {

  public baseApiUrl = "http://localhost:8080/funcionario";

  constructor(
    private http: HttpClient
  ) { }

  public cadastrarFuncionario(funcionario: Funcionario): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/cadastrar`, funcionario);
  }

}

