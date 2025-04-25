import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConexionesService {

  urlIp = environment.urlIp + '/api/';

  constructor(
    public http: HttpClient,
  ) { }

  // ----------------- SERVICIO PARA BUSCAR EL LOGIN -------------------------------/
  getlogin<T>(usuario: string, clave: string): Observable<any> {
    return this.http.get<T[]>(this.urlIp + 'login/' + usuario + '/' + clave);
  }
 
  // ------------------ JUGADORES ----------------------
  putJugadores(id: number, ico: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      ico: ico
    };

    return this.http.put(`${this.urlIp}jugadores/${id}/${ico}`, body, { headers });
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
      return this.http.put<any>(this.urlIp + 'jugadorUpdateViewAvisoById/' + id, {});
    }







}
