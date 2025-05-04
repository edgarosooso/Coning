import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConexionesService } from './conexiones.service';

interface LoginResponse {
  success: boolean;
  userData?: UserData; // Para almacenar los datos del usuario en la respuesta del login
}

interface UserData {
  ID: number;
  rutaAvatar: string;
  nombre: string;
  Ico: number;
  ViewAviso: boolean;
  ingreso: boolean; // Asegúrate de incluir todas las propiedades que utilizas
  nombreJugador1: string;
  // Otros campos del usuario
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.estaAutenticadoInicial()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userDataSubject = new BehaviorSubject<UserData | null>(
    this.getUserDataFromStorage()
  ); // Para almacenar los datos del usuario
  public userData$ = this.userDataSubject.asObservable();

  constructor(private conexionesService: ConexionesService) {}

  private estaAutenticadoInicial(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  estaAutenticado(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private setUserDataToStorage(userData: UserData): void {
    localStorage.setItem('id', userData.ID.toString());
    localStorage.setItem('icoTabla', userData.Ico.toString());
    localStorage.setItem('Jugador1', userData.nombre);
    localStorage.setItem('avatar1', userData.rutaAvatar);
    localStorage.setItem('ingreso', 'si');
    localStorage.setItem('viewHands', userData.ViewAviso.toString());
    localStorage.setItem('nombreJugador1', userData.nombre);
    this.userDataSubject.next(userData);
  }

  private getUserDataFromStorage(): UserData | null {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      return {
        ID: parseInt(localStorage.getItem('id') || '0', 10),
        Ico: parseInt(localStorage.getItem('icoTabla') || '0', 10),
        nombre: localStorage.getItem('Jugador1') || '',
        rutaAvatar:
          localStorage.getItem('avatar1') || '../../assets/avatar/eli.png',
        ingreso: localStorage.getItem('ingreso') === 'si',
        ViewAviso: localStorage.getItem('viewHands') === 'true',
        nombreJugador1: localStorage.getItem('nombreJugador1') || '',
      } as UserData;
    }
    return null;
  }

  consultarLogin(usuario: string, clave: string): Observable<LoginResponse> {
    console.log('usuario', usuario, 'clave', clave);
    return this.conexionesService.getlogin(usuario, clave).pipe(
      tap((response) => {
        if (response && response.success) {
          // Ahora verificas la propiedad 'success'
          this.isAuthenticatedSubject.next(true);
          localStorage.setItem('isAuthenticated', 'true');
          if (response.userData) {
            this.setUserDataToStorage(response.userData);
          }
        }
      })
    );
  }

  obtenerDatosUsuario(): Observable<UserData | null> {
    return this.userData$;
  }

  cerrarSesion(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('id');
    localStorage.removeItem('icoTabla');
    localStorage.removeItem('Jugador1');
    localStorage.removeItem('avatar1');
    localStorage.removeItem('ingreso');
    localStorage.removeItem('viewHands');
    localStorage.removeItem('nombreJugador1');
    this.userDataSubject.next(null);
  }
}
