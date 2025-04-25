import { Injectable, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocketWebService extends Socket {
  // EventEmitter para emitir eventos recibidos del socket
  outEven: EventEmitter<any> = new EventEmitter();
  private eventObservers = new Map<string, Function>();

  constructor() {
    localStorage.clear();
    const sala = localStorage.getItem('sala');
    super({
      url: environment.serverSocket,
      options: {
        query: {
          nameRoom: sala ? sala : 'defaultRoom', // Usa 'defaultRoom' si sala es null
        },
      },
    });
    this.setupListeners(['evento', 'otroEvento']);
  }

  // Método para configurar la escucha de múltiples eventos del socket
  private setupListeners(events: string[]) {
    events.forEach((event) => {
      const handler = (res: any) => {
        this.outEven.emit(res);
        const callback = this.eventObservers.get(event);
        if (callback) {
          callback(res);
        }
      };
      this.ioSocket.on(event, handler);
    });
  }

  // Método para suscribirse a eventos de forma controlada
  onEvent(event: string): Observable<any> {
    return new Observable<any>((subscriber) => {
      const handler = (data: any) => subscriber.next(data);

      this.ioSocket.on(event, handler);

      this.eventObservers.set(event, handler);

      return () => {
        this.ioSocket.off(event, handler);
        this.eventObservers.delete(event);
      };
    }).pipe(
      catchError((error) => {
        console.error(`Error en el evento ${event}:`, error);
        return throwError(() => new Error(`Error en el evento ${event}`));
      })
    );
  }

  // Método para emitir eventos hacia el servidor
  emitEvent(event: string, payload: any) {
    this.ioSocket.emit(event, payload);
  }

  // Método para verificar la conexión del socket
  isConnected(): boolean {
    return this.ioSocket && this.ioSocket.connected;
  }

  // Método para conectar el socket
  connectSocket() {
    if (!this.isConnected()) {
      this.ioSocket.connect();
    }
  }

  // Método para desconectar el socket
  disconnectSocket() {
    if (this.isConnected()) {
      this.ioSocket.disconnect();
    }
  }

  // Método para desconectar un evento específico
  // disconnectEvent(event: string) {
  //   const handler = this.eventObservers.get(event);
  //   if (handler) {
  //     this.ioSocket.off(event, handler);
  //   }
  //   this.eventObservers.delete(event);
  // }

  // Método para desconectar un evento específico
  disconnectEvent(event: string) {
    const handler = this.eventObservers.get(event) as
      | ((...args: any[]) => void)
      | undefined; // Cast to correct type
    if (handler) {
      this.ioSocket.off(event, handler);
    }
    this.eventObservers.delete(event);
  }
}
