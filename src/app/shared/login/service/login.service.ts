import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Funcionario } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public baseApiUrl = "http://localhost:8080/funcionario";

  constructor(
    private http: HttpClient
  ) { }

  public login(dadosLogin: any): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.baseApiUrl}/login`, dadosLogin);
  }
}
