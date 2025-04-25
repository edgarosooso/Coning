import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface Alert {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts: Alert[] = [];
  private alertSubject = new Subject<Alert[]>();

  getAlerts(): Observable<Alert[]> {
    return this.alertSubject.asObservable();
  }

  addAlert(type: 'success' | 'error' | 'info' | 'warning', message: string): void {
    const alert: Alert = {
      id: new Date().getTime(),
      type,
      message
    };
    console.log('Alerta agregada:', alert);  // Verificación
    this.alerts.push(alert);
    this.alertSubject.next(this.alerts);
  }

  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
    this.alertSubject.next(this.alerts);
  }
}
