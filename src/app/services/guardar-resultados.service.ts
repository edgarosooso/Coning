import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardarResultadosService {

  constructor() { }
  
  guardarResultados(resultado: any) {
    localStorage.setItem('resultadoJuego', JSON.stringify(resultado));
  }

  obtenerResultados(): any {
    const resultadoJuego = localStorage.getItem('resultadoJuego');
    return resultadoJuego ? JSON.parse(resultadoJuego) : null;
  }
}
