import { Component, OnInit } from '@angular/core';
import { SocketWebService } from '../services/socket-web.service';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

@Component({
  selector: 'app-jugadores-en-sala',
  templateUrl: './jugadores-en-sala.page.html',
  styleUrls: ['./jugadores-en-sala.page.scss'],
})
export class JugadoresEnSalaPage implements OnInit {
  private informacionSalasSubscription: Subscription | undefined;
  private espectadorSubscription: Subscription | undefined;


  constructor(
    private socketWebService: SocketWebService,
    private navCtrl: NavController,
  ) { }


  ngOnInit() {
    // Si la autenticación es exitosa, conecta el socket.
    this.solicitarSalas();
    this.nombreEspectador = localStorage.getItem("nombreJugador1") || "espectador";
    this.nombreAvatarEspectador = localStorage.getItem("avatarugador1") || '../../assets/img/gif/Ficha1.gif';


  }

  ngOnDestroy() {
    // Desuscribirse de todas las suscripciones activas para evitar fugas de memoria
    this.informacionSalasSubscription?.unsubscribe();
  }

  juegosSalas: any[] = []

  nombreSala: string = '';
  jugador1: string = '';
  jugador2: string = '';
  nombreEspectador: string = '';
  nombreAvatarEspectador: string = '';


  /*----------------------------------------------------------------------------------------
                                INFORMACION DE SALAS 
  -----------------------------------------------------------------------------------------*/

  solicitarSalas() {

    this.informacionSalasSubscription?.unsubscribe(); // Limpieza de suscripción
    this.informacionSalasSubscription = this.socketWebService.onEvent('informacionSalas').subscribe(data => {
      //   console.log('------------ informacionSalas:', data);

      //const juegos = data.juegos;
      this.procesarSalas(data.juegos);

      //this.nombreSala = Object.keys(data.juegos)[0];
      //console.log(this.nombreSala);
      // Accediendo al nombre de usuario del primer jugador en el array 'jugadores' dentro de 'juegos'
      //  this.jugador1 = data.juegos[this.nombreSala].jugadores[0].usuario;
      //   this.jugador2 = data.juegos[this.nombreSala].jugadores[1].usuario;
      // Ahora puedes usar 'nombreUsuarioPrimerJugador' para acceder al nombre del primer jugador
      // console.log(this.jugador1, ' usuario 2 ', this.jugador2); // Esto imprimirá el nombre del primer jugador
      // this.nombreSala = Object.keys(data.juegos)[0];
      //this.recibirInfoSalas(data);
    });

    this.socketWebService.emitEvent('informacionSalas', {});
  }

  procesarSalas(data: any) {
    const salasTemporales: any[] = [];

    Object.keys(data).forEach(salaId => {
      const sala = data[salaId];

      // Verifica que la sala tenga al menos un jugador antes de intentar acceder a ellos
      if (sala.jugadores && sala.jugadores.length > 0) {
        // Preparar un objeto para almacenar la información de la sala y los jugadores
        const infoSala = {
          id: salaId,
          jugador1: sala.jugadores[0] ? sala.jugadores[0].usuario : 'Jugador 1 no disponible',
          jugador2: sala.jugadores[1] ? sala.jugadores[1].usuario : 'Jugador 1 no disponible'
        };


        // Agregar la información al array temporal
        salasTemporales.push(infoSala);
      } else {
        // Maneja el caso de salas vacías o datos mal formados
        salasTemporales.push({
          id: salaId,
          jugador1: 'Jugador 1 no disponible',
          jugador2: 'Jugador 2 no disponible'
        });
      }
    });

    // Asignar el array temporal a this.juegosSalas para actualizar la UI solo una vez
    this.juegosSalas = salasTemporales;

    // Visualizar la información procesada
    console.table(this.juegosSalas);
  }



  /*----------------------------------------------------------------------------------------
                          ENVIAR LA SOLICITUD PARA VER EL JUEGO 
  -----------------------------------------------------------------------------------------*/

  solicitarEspectador(sala: string) {
    this.espectadorSubscription?.unsubscribe(); // Limpieza de suscripción
    this.espectadorSubscription = this.socketWebService.onEvent('espectador').subscribe(data => {
      console.log('------------ espectador:', data);

    });

    this.socketWebService.emitEvent('espectador', {
      sala: sala,
      nombreEspectador: this.nombreEspectador,
    });

    this.navCtrl.navigateForward('/espectadores')

  }


}
