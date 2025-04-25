// src/app/models/click-event-data.model.ts

export interface ClickEventData {
    botonIndexDos: number;
    nombreImagenDos: string | null;
    hora: string;
    hizoPareja: boolean;
    clics: number;
    juegoTerminado: boolean;
    nombreJugadorA: string;
    nombreJugadorB: string;
    puntosA: number;
    puntosB: number;
    resultadofinal1: string;
    resultadofinal2: string;
    sala: string;
    socket1: string;
    socket2: string;
    socketJugador1: string;
    turnoJugador: boolean;
    urlAvatar1: string;
    urlAvatar2: string;
  }
  