// src/app/services/seleccion.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeleccionService {
  constructor() { }

  seleccionarDosNumeros<T>(arr: T[]): T[] | null {
    if (arr.length < 2) {
      return null;  // No hay suficientes elementos para seleccionar dos
    }
    let idx1 = Math.floor(Math.random() * arr.length);
    let idx2;
    do {
      idx2 = Math.floor(Math.random() * arr.length);
    } while (idx1 === idx2);  // Asegura que no se seleccione el mismo índice dos veces
    return [arr[idx1], arr[idx2]];
  }
}
