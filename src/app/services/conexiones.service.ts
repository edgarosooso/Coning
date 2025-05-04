import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface LoginBackendResponse {
  usuarios: any[]; // Ajusta el tipo según la estructura real de tu backend
  // ... otras propiedades
}

interface LoginResponse {
  success: boolean;
  userData?: any; // Ajusta el tipo según la estructura real de tus datos de usuario
}

@Injectable({
  providedIn: 'root',
})
export class ConexionesService {
  urlIp = environment.urlIp + '/api/';

  constructor(public http: HttpClient) {}

  //  ----------------- SERVICIO PARA BUSCAR EL LOGIN
  getlogin<T>(usuario: string, clave: string): Observable<LoginResponse> {
    console.log('------------', usuario, clave);

    return this.http
      .get<LoginBackendResponse>(this.urlIp + 'login/' + usuario + '/' + clave)
      .pipe(
        map((responseBackend) => {
          let success = false;
          let userData = undefined;

          if (
            responseBackend &&
            Array.isArray(responseBackend) &&
            responseBackend.length > 0
          ) {
            success = true;
            userData = responseBackend[0];
          } else {
            console.log(
              'Error en la estructura de la respuesta del backend:',
              responseBackend
            );
          }

          return { success, userData };
        })
      );
  }

  // getlogin<T>(usuario: string, clave: string): Observable<any> {
  //   return this.http.get<T[]>(this.urlIp + 'login/' + usuario + '/' + clave);
  // }

  // ------------------ JUGADORES ----------------------
  putJugadores(id: number, ico: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      ico: ico,
    };

    return this.http.put(`${this.urlIp}jugadores/${id}/${ico}`, body, {
      headers,
    });
  }

  // ----------------- SERVICIO PARA BUSCAR LOS RANGOS -------------------------------/
  getRankin<T>(): Observable<any> {
    return this.http.get<T[]>(this.urlIp + 'ranking/');
  }

  // ----------------- SERVICIO PARA BUSCAR JUGADOR POR ID -------------------------------/
  getJugadorById<T>(id: number): Observable<any> {
    return this.http.get<T[]>(this.urlIp + 'jugadorById/' + id);
  }

  UpdateViewAvisoById(id: number): Observable<any> {
    return this.http.put<any>(
      this.urlIp + 'jugadorUpdateViewAvisoById/' + id,
      {}
    );
  }
}
