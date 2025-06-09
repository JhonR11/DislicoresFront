import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../../../shared/constans';

interface LoginResponse {
  error: LoginResponse;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiURL = baseURL.concat("auth");

  constructor(private router:Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    console.log('Intentando iniciar sesión con:', { email, password });
    return from(
      fetch(this.apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({ email, password }),
      }).then(async (response) => {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Credenciales inválidas');
        }

        localStorage.setItem('accessToken', data.data.accessToken);
        return data.data as LoginResponse;
      })
    ).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message || 'Error de red'));
      })
    );
  }

}
