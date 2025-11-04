import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {

    public readonly urlServidorFrontLogin: string = 'http://localhost:4200/login'
  public readonly urlServidorBackLogin: string = 'http://localhost:8080'

  public readonly urlServidorBackendDaPropriaAplicacao: string = 'http://localhost:8080';

  
  
  constructor() { }

  public getServidor(): string {
    return this.urlServidorBackendDaPropriaAplicacao;
  }
}
