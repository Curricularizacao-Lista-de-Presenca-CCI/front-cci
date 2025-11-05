import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionariosAtivosDTO } from '../../models/funcionarios-ativos-dto';

@Injectable({
  providedIn: 'root'
})
export class ListaChamadaService {

  public baseApiUrl = "http://localhost:8080/relatorios";
  public baseApiUrlEvento = "http://localhost:8080/evento";
  public baseApiUrlFuncionario = "http://localhost:8080/funcionario";

  constructor(
    private http: HttpClient
  ) { }

  public importarChamada(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrlEvento}/enviar-arquivo`, formData);
  }

  public buscarFuncionariosAtivos(): Observable<FuncionariosAtivosDTO[]> {
    return this.http.get<FuncionariosAtivosDTO[]>(`${this.baseApiUrlFuncionario}/buscar-funcionarios-ativos`);
  }

  public buscarPDF(idEvento: number): Observable<Blob> {
    return this.http.get(`${this.baseApiUrl}/buscar-pdf/${idEvento}`, {
      responseType: 'blob'
    });
  }
}
