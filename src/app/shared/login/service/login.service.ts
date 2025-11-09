import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public baseApiUrl = "http://localhost:8080/funcionario";

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) { }

  public login(dadosLogin: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/login`, dadosLogin)
      .pipe(
        tap(response => {
          const token = response.token;

          if (token) {
            localStorage.setItem("token", token);
            this.tokenService.carregarToken();
            this.router.navigate(['/']);
          }
        })
      );
  }
}