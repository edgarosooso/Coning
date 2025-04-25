import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeTemporizador {

  private tiempoInicial = 120; // 2 minutos en segundos
  private tiempoActualTimer1 = new BehaviorSubject<number>(this.tiempoInicial);
  private tiempoActualTimer2 = new BehaviorSubject<number>(this.tiempoInicial);

  private subscripcionTimer1?: Subscription;
  private subscripcionTimer2?: Subscription;
  private timer1Pausado = false;
  private timer2Pausado = false;
  private tiempoPausadoTimer1 = this.tiempoInicial; // Inicialización
  private tiempoPausadoTimer2 = this.tiempoInicial;


  constructor() {
    this.iniciarCuentaAtrasTimer1();
    this.iniciarCuentaAtrasTimer2();

    // Suscribirse al evento beforeunload para guardar el estado de los temporizadores antes de salir de la página
    window.addEventListener('beforeunload', () => {
      this.guardarEstadoTemporizadores();
    });

    // Restaurar el estado de los temporizadores si hay datos guardados en el almacenamiento local
    this.restaurarEstadoTemporizadores();
  }

  reiniciarTemporizadores(): void {
    this.tiempoActualTimer1.next(this.tiempoInicial);
    this.tiempoActualTimer2.next(this.tiempoInicial);
    this.iniciarCuentaAtrasTimer1();
    this.iniciarCuentaAtrasTimer2();
  }

  
  iniciarCuentaAtrasTimer1(): void {
    this.detenerTimer1();
    if (this.timer1Pausado) {
      this.tiempoActualTimer1.next(this.tiempoPausadoTimer1);
    } else {
      this.tiempoActualTimer1.next(this.tiempoInicial);
    }
    
    this.subscripcionTimer1 = interval(1000).pipe(
      map(() => this.tiempoActualTimer1.value - 1),
      takeWhile(tiempo => tiempo >= 0)
    ).subscribe(tiempo => {
      this.tiempoActualTimer1.next(tiempo);
    });
  }

  detenerTimer1(): void {
    if (this.subscripcionTimer1) {
      this.subscripcionTimer1.unsubscribe();
      this.subscripcionTimer1 = undefined;
    }
    this.tiempoPausadoTimer1 = this.tiempoActualTimer1.value;
    this.timer1Pausado = true;
    this.timer2Pausado = false; // Cambiar timer2Pausado a false
  }

  reanudarCuentaAtrasTimer1(): void {
    this.timer1Pausado = false;
    this.iniciarCuentaAtrasTimer1();
  }

  obtenerCuentaAtrasTimer1(): Observable<number> {
    return this.tiempoActualTimer1.asObservable();
  }

  public iniciarCuentaAtrasTimer2(): void {
    this.detenerTimer2();
    if (this.timer2Pausado) {
      this.tiempoActualTimer2.next(this.tiempoPausadoTimer2);
    } else {
      this.tiempoActualTimer2.next(this.tiempoInicial);
    }

    this.subscripcionTimer2 = interval(1000).pipe(
      map(() => this.tiempoActualTimer2.value - 1),
      takeWhile(tiempo => tiempo >= 0)
    ).subscribe(tiempo => {
      this.tiempoActualTimer2.next(tiempo);
    });
  }

  detenerTimer2(): void {
    if (this.subscripcionTimer2) {
      this.subscripcionTimer2.unsubscribe();
      this.subscripcionTimer2 = undefined;
    }
    this.tiempoPausadoTimer2 = this.tiempoActualTimer2.value;
    this.timer2Pausado = true; // Cambiar timer2Pausado a true
  }

  obtenerCuentaAtrasTimer2(): Observable<number> {
    return this.tiempoActualTimer2.asObservable();
  }

  reanudarCuentaAtrasTimer2(): void {
    this.timer2Pausado = false;
    this.iniciarCuentaAtrasTimer2();
  }

  private guardarEstadoTemporizadores(): void {
    localStorage.setItem('timerState', JSON.stringify({
      timer1Pausado: this.timer1Pausado,
      timer2Pausado: this.timer2Pausado,
      tiempoPausadoTimer1: this.tiempoPausadoTimer1,
      tiempoPausadoTimer2: this.tiempoPausadoTimer2
    }));
  }

  private restaurarEstadoTemporizadores(): void {
    const storedState = localStorage.getItem('timerState');
    if (storedState) {
      const state = JSON.parse(storedState);
      this.timer1Pausado = state.timer1Pausado;
      this.timer2Pausado = state.timer2Pausado;
      this.tiempoPausadoTimer1 = state.tiempoPausadoTimer1;
      this.tiempoPausadoTimer2 = state.tiempoPausadoTimer2;
    }
  }


  verificarTemporizador1AlCero(): Observable<boolean> {
    return this.tiempoActualTimer1.pipe(
      map(tiempo => tiempo === 0)
    );
  }

  verificarTemporizador2AlCero(): Observable<boolean> {
    return this.tiempoActualTimer2.pipe(
      map(tiempo => tiempo === 0)
    );
  }

}
