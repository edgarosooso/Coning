
/*
ionViewWillEnter: Se dispara cuando la página está a punto de entrar y convertirse en la página activa.
ionViewDidEnter: Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.

ionViewWillLeave: Se activa cuando la página está a punto de dejar de ser la página activa.
ionViewDidLeave: Se dispara después de que la página ha dejado de ser visible.
*/

import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { SocketWebService } from '../services/socket-web.service';
import { Subscription } from 'rxjs';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-sala-espera',
  templateUrl: './sala-espera.page.html',
  styleUrls: ['./sala-espera.page.scss'],
})
export class SalaEsperaPage implements OnInit {
  private onlineSubscription: Subscription | undefined;
  private salirdeonline: Subscription | undefined;
  private enviarInvitacionAJugar: Subscription | undefined;
  private rtaInvitacionAJugar: Subscription | undefined;
  private recibirjuadoresOnLine: Subscription | undefined;
  private salioDelJuegoSubscription: Subscription | undefined;
  private noAceptoSubscription: Subscription | undefined;



  private abrirJuegoSubscription: Subscription | undefined;

  // En tu componente de Angular
  rutaAuxiliar: string = '';
  datosRecibidos: string = '';
  jugadoresAvatar: any[] = [];
  ico: number  = 0;
  imgAvatarConectado: string = '';

  usuario: string = '';
  nombreAvatar: string = '';
  urlAvatar: string = '';
  mensaje: string = '';
  hora: string = '';
  salaId: string = '';
  salaInvitado: string = '';
  sOption: string = '';
  timerID: number = 0;
  nombreJugador: string = '';
  nombreElQueInvita: string = '';
  loading: any;
  jugadores: any[] = [];
  datosServidor: any[] = [];
  respuestaServidor: any[] = [];
  idTabla: number = -1;
  icoTabla : number = 0;


  nombreJugadores: any[] = [];
  sSocket: string = '';
  nivel: number = 0;

  jugadorTabla: string = '';

  constructor(
    private socket: Socket,
    private alertController: AlertController,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private socketWebService: SocketWebService,

  ) {
 
    this.imgAvatarConectado = localStorage.getItem("avatar1") || "../assets/img/gif/Ficha1.gif'";
    this.nombreJugador = localStorage.getItem("Jugador1") || "jugador1";
    this.usuario = localStorage.getItem("Jugador1") || "jugador1";
    console.log("Jugador1 ", this.nombreJugador, '  avatar1 ', this.imgAvatarConectado)

    this.rtaNpAcepto();



    this.rtaInvitacionAJugar?.unsubscribe();
    this.rtaInvitacionAJugar = this.socketWebService.onEvent('rta-invitar-A-Jugar-online').subscribe(datos => {
      console.log("datos ", datos.info.jugador1, datos.info.jugador2, datos.info.socket2, datos.info.rutaAvatar)
    
      this.presentAlertConfirm(datos.rta, 0, datos.info.jugador1, datos.socket1, datos.info.jugador2, datos.socket1 , datos.sala, datos.info)
    });

    this.abrirJuegoSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    this.abrirJuegoSubscription = this.socketWebService.onEvent('abrir-juego').subscribe(datos => {
      console.log('Respuesta del servidor al espectador:', this.jugadoresAvatar);
      this.navCtrl.navigateForward('/jugador-contra-jugador');
    });

    /* -----------------------------------------------------------------------------------------------
                                        JUGADORES ON LINE
   -----------------------------------------------------------------------------------------------*/
    this.recibirjuadoresOnLine?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    this.recibirjuadoresOnLine = this.socketWebService.onEvent('recibir-jugadores-online').subscribe(datos => {
      // Filtrar el array para obtener un nuevo array que excluya al jugador con el nombre especificado
      this.jugadoresAvatar = datos.jugadoresAvatar.filter((jugador: { nombre: string; ico: string; rutaAvatar: string; visualizar: boolean }) =>
        jugador.visualizar == true
      );

      this.jugadoresAvatar = datos.jugadoresAvatar.filter((jugador: { nombre: string; ico: string; rutaAvatar: string; visualizar: boolean }) =>
        jugador.nombre !== this.usuario
      );
      console.log('Respuesta  recibir-jugadores-online:', this.jugadoresAvatar);

    });

    this.recibirjuadoresOnLine?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    this.recibirjuadoresOnLine = this.socketWebService.onEvent('enviar-jugadores').subscribe(datos => {
      // Filtrar el array para obtener un nuevo array que excluya al jugador con el nombre especificado
      this.jugadoresAvatar = datos.jugadoresAvatar.filter((jugador: { nombre: string; ico: string; rutaAvatar: string; socketid: string; visualizar: boolean }) =>
        jugador.visualizar == true && jugador.nombre !== this.usuario
      );
      console.log('Respuesta  visuzliar:', this.jugadoresAvatar);

    });

  }



  ionViewDidEnter() {
    //Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.

 
    this.idTabla = Number(localStorage.getItem("id")) || -1;
    this.icoTabla = Number(localStorage.getItem("icoTabla")) || 0;
    this.ico = Number(localStorage.getItem("icoTabla")) || 0;

    this.agregarJugadorOnline();
  }















  ionViewWillEnter() {
    //   // Código que se ejecutará cada vez que la página esté a punto de entrar en la vista
    this.emitirSalidadDeJuego(0);
  }
  /* ----------------------------------------------------------------------------------------
                                    SALIENDO DE LA PAGINA
  -----------------------------------------------------------------------------------------*/
  ionViewWillLeave() {
    this.emitirSalidadDeJuego(1);
  }


  /*----------------------------------------------------------------------------------------
                             SALIO DEL JUEGO 
  -----------------------------------------------------------------------------------------*/
  emitirSalidadDeJuego(opc: number) {
    this.salioDelJuegoSubscription?.unsubscribe(); // Limpieza de suscripción
    this.salioDelJuegoSubscription = this.socketWebService.onEvent('leave').subscribe(data => {
    });


    this.socketWebService.emitEvent('leave', {
      opc: opc,
      room: '',
      nombre: this.nombreJugador,
    });
  }

  ngOnInit() {
    // this.ico = '172';
    // this.imgAvatarConectado = localStorage.getItem("avatar1") || "../assets/img/gif/Ficha1.gif'";
    // this.nombreJugador = localStorage.getItem("Jugador1") || "jugador1";
    // this.usuario = localStorage.getItem("Jugador1") || "jugador1";
    // console.log("Jugador1 ", this.nombreJugador, '  avatar1 ', this.imgAvatarConectado)


    // this.agregarJugadorOnline();


  }

  ngOnDestroy() {

    //this.salirDeOnline();
    // Desuscribirse de todas las suscripciones activas para evitar fugas de memoria
    this.onlineSubscription?.unsubscribe();
    this.salirdeonline?.unsubscribe();
    this.enviarInvitacionAJugar?.unsubscribe();
    this.rtaInvitacionAJugar?.unsubscribe();
    this.abrirJuegoSubscription?.unsubscribe();
    this.recibirjuadoresOnLine?.unsubscribe();
    this.salioDelJuegoSubscription?.unsubscribe();
    this.recibirjuadoresOnLine?.unsubscribe();
    this.noAceptoSubscription?.unsubscribe();

  }



  /*----------------------------------------------------------------------------------------
                                 AGREGAR JUGADORES  ONLINE 
   -----------------------------------------------------------------------------------------*/
  agregarJugadorOnline() {
    this.onlineSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    this.onlineSubscription = this.socketWebService.onEvent('recibir-jugadores-online').subscribe(datos => {
      // Filtrar el array para obtener un nuevo array que excluya al jugador con el nombre especificado
      this.jugadoresAvatar = datos.jugadoresAvatar.filter((jugador: { nombre: string; ico: string; rutaAvatar: string; visualizar: boolean }) =>
        jugador.nombre !== this.usuario
      );
      console.log('Respuesta  visuzliar:', this.jugadoresAvatar);

    });

    this.socketWebService.emitEvent('jugadores-online', {
      nombre: this.nombreJugador,
      rutaAvatar: this.imgAvatarConectado,
      ico: this.ico,
    });

  }




  /*----------------------------------------------------------------------------------------
                                 ACEPTO EL JUEGO ENVIAR PARA ABRIR LOS DOS
   -----------------------------------------------------------------------------------------*/
  invitarAjugar(nombre: string, socket: string, datos: any, sala: string) {

    // this.abrirJuegoSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    // this.abrirJuegoSubscription = this.socketWebService.onEvent('abrir-juego').subscribe(datos => {
    //   console.log('Respuesta del servidor al espectador:', this.jugadoresAvatar);
    // });

 
    this.socketWebService.emitEvent('abrir-juego', {
      datos: datos,
      socket1: socket,
      sala: sala,
      idTabla: this.idTabla,
      ico: this.icoTabla,
    });

  }


  /*----------------------------------------------------------------------------------------
                                 NO ACEPTO EL JUEGO 
   -----------------------------------------------------------------------------------------*/
  noAceptoInvitacion(nombre1: string, nombre2: string, socket2: string) {
    this.socketWebService.emitEvent('no-acepto', {
      nombre1: nombre1,
      nombre2: nombre2,
      socket2: socket2,
    });
  }

  rtaNpAcepto() {
    this.noAceptoSubscription?.unsubscribe();
    this.noAceptoSubscription = this.socketWebService.onEvent('no-acepto').subscribe(datos => {
      this.presentAlert("jugador no aceptola inviación");
    });
  }



  /*----------------------------------------------------------------------------------------
                                 SALIR DE LA PAGINA  
   -----------------------------------------------------------------------------------------*/
  // salirDeOnline() {
  //   this.salirdeonline?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
  //   this.salirdeonline = this.socketWebService.onEvent('quitar-Jugador').subscribe(datos => {

  //     // this.jugadoresAvatar = datos.jugadoresAvatar.filter((jugador: { nombre: string; ico: string; rutaAvatar: string }) => jugador.nombre !== this.usuario);

  //     // console.log('Respuesta del servidor al espectador:', this.jugadoresAvatar);

  //   });

  //   this.socketWebService.emitEvent('quitar-Jugador', {
  //     nombre: this.nombreJugador,
  //   });

  // }

  // recibirJugadoreOnline(datos: any) {
  //   this.jugadoresAvatar = datos;
  //   console.log('Respuesta jugadoresAvatar:', this.jugadoresAvatar);
  // }

  /*----------------------------------------------------------------------------------------
                                 INVITACION A JUGAR ONLINE  
   -----------------------------------------------------------------------------------------*/
  invitacionAJugar(jugador2: string, socket2: string, rutaAvatar2: string) {
    console.log('jugador2 ', jugador2, ' socket2 ', socket2, ' rutaAvatar2 ', rutaAvatar2)
    this.enviarInvitacionAJugar?.unsubscribe();
    this.enviarInvitacionAJugar = this.socketWebService.onEvent('invitar-A-Jugar-online').subscribe(datos => {
      console.log(datos.rta);

      //this.presentAlert(datos.rta)

    });

    this.socketWebService.emitEvent('invitar-A-Jugar-online', {
      jugador1: this.nombreJugador,
      jugador2: jugador2,
      socket2: socket2,
      rutaAvatar1: this.imgAvatarConectado,
      rutaAvatar2: rutaAvatar2,
      idTabla: this.idTabla,
      ico: this.icoTabla,


    });
  }







  /* ----------------------------------------------------------------------------------------
                                     Alerta confirmar
   -----------------------------------------------------------------------------------------*/

  async presentAlertConfirm(message: string, opc: number, nombre: string, socketId: string, nombreDos: string,   socket2: string, sala: string, datos: any) {

    

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message,
      buttons: [
        {
          text: 'Si',
          id: 'confirm-button',
          handler: () => {

            switch (opc) {
              case 0:
                this.invitarAjugar(nombre, socketId, datos, sala);
                break;

              case 1: // acepto la invitacion a jugar
                //  this.invitacionAceptada(nombre, socketId, nombreDos, socket2);
                break;

              case 2: // revancha
                // this.revanchaAceptada(sala, 'si');
                break;
            }
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');


            switch (opc) {
              case 0:
               
                this.noAceptoInvitacion(nombre, nombreDos, socket2);
                break;

              //   case 1: // acepto la invitacion a jugar
              //     //this.invitacionAceptada(nombre, socketId, nombreDos, socket2);
              //   //  this.noAceptoInvitacion(socket2);
              //     break;

              //   case 2: // no acepto la revancha
              //   //  this.revanchaAceptada(sala, 'no');
              //      break;
            }

          }
        }

      ]
    });

    await alert.present();
  }

  /* -----------------------------------------------------------------------------
                      PRESEN LOADING
  --------------------------------------------------------------------------------*/
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Dokasoft',
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


} //fin