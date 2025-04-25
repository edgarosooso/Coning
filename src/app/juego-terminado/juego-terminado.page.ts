/*
ionViewWillEnter: Se dispara cuando la página está a punto de entrar y convertirse en la página activa.
ionViewDidEnter: Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.
ionViewWillLeave: Se activa cuando la página está a punto de dejar de ser la página activa.
ionViewDidLeave: Se dispara después de que la página ha dejado de ser visible.
*/
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { SocketWebService } from '../services/socket-web.service';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { GuardarResultadosService } from '../services/guardar-resultados.service';
import { Howl } from 'howler';
import { ConexionesService } from '../services/conexiones.service';


@Component({
  selector: 'app-juego-terminado',
  templateUrl: './juego-terminado.page.html',
  styleUrls: ['./juego-terminado.page.scss'],
})
export class JuegoTerminadoPage implements OnInit {
  subscribe: any;
  ganadorIndex: number = -1; // Propiedad para almacenar el índice del jugador ganador
  @ViewChild('jugador1', { static: false, read: ElementRef }) jugador1Ref?: ElementRef;
  @ViewChild('jugador2', { static: false, read: ElementRef }) jugador2Ref?: ElementRef;


  idTabla: number = 0;

  currentURL: string = '';
  mostrarRevancha: boolean = false;  // Cambia esto para mostrar/ocultar
  jugadorSolo: boolean = false;
  revanchaTitulo: string = '';
  nombreStoraage: string = '';
  nombrejugador1: string = '';
  nombreJugador2: string = '';
  avatarJugador1: string = '';
  avatarJugador2: string = '';
  socketInvitado: string = '';
  puntosA: string = '';
  puntosB: string = '';
  gano: string = '';
  sOption: string = '';
  sala: string = '';
  nombreInvitado: string = '';
  resultadoJuego: any;
  counter: any

  ico1: number = 0;
  ico2: number = 0;

  constructor(
    private socketWebService: SocketWebService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private guardarResultadosService: GuardarResultadosService,
    private platform: Platform,
    private renderer: Renderer2,
    private conexionesService: ConexionesService,
  ) {
    //this.nombreStoraage = localStorage.getItem('nombre-jugador') ?? '';
    // this.nombreStoraage = localStorage.getItem('Jugador1') ?? '';

    //   localStorage.setItem('Jugador1', this.nombreStoraage);


    //    this.sala = localStorage.getItem('sala');
    //this.recibirInformacionBackend();

    this.initializeBackButtonCustomHandler();
  }


  initializeBackButtonCustomHandler(): void {
    this.subscribe = this.platform.backButton.subscribeWithPriority(666666, () => {
      if (this.constructor.name === '/home') {
        alert('¿Desea salir de juego terminado');
      }
    });
  }

  ngOnInit() {

    this.sonidosdelJuego();
    // Obtener el resultado del juego al cargar la página
    this.resultadoJuego = this.guardarResultadosService.obtenerResultados();
    console.log("resultado del juego ", this.resultadoJuego);

    // Obtener el resultado del juego al cargar la página
    this.resultadoJuego = this.guardarResultadosService.obtenerResultados();



    this.revanchaTitulo = 'Revancha'
    this.jugadorSolo = false;

    this.ico1 = this.resultadoJuego.jugador1.iCo;
    this.ico2 = this.resultadoJuego.jugador2.iCo;

    this.nombrejugador1 = this.resultadoJuego.jugador1.nombre;

    this.puntosA = this.resultadoJuego.jugador1.puntos
    this.nombreJugador2 = this.resultadoJuego.jugador2.nombre;
    this.puntosB = this.resultadoJuego.jugador2.puntos


    this.avatarJugador1 = this.resultadoJuego.jugador1.urlAvatar
    this.avatarJugador2 = this.resultadoJuego.jugador2.urlAvatar

    this.ganadorIndex = -1;

    this.ganadorIndex = this.puntosA > this.puntosB ? 0 : this.puntosA < this.puntosB ? 1 : -1;



    this.idTabla = Number(localStorage.getItem('id'));

    this.conexionesService.getJugadorById(this.idTabla).subscribe(datos => {
      if (datos.length > 0) {
        localStorage.setItem("icoTabla", datos[0].Ico);
        //console.table(datos)
      }

    })

  }
 


  ionViewDidLeave() {
    clearInterval(this.counter);
  }







  // limpiarNombre(nombre: string): string | null {
  //   // Usando una expresión regular para extraer el nombre entre paréntesis
  //   var regex = /\(([^)]+)\)/;
  //   var resultado = regex.exec(nombre);

  //   // Si se encuentra una coincidencia, el resultado estará en resultado[1]
  //   if (resultado) {
  //     var valorDeseado = resultado[1];
  //     return valorDeseado;
  //   } else {
  //     return null; // Devolver null si no se encontraron coincidencias
  //   }
  // }





  regresar() {
     this.navCtrl.navigateRoot('/ranking')
  }


  // agregarClaseGanador() {
  //   const columnaElement = this.miColumna.nativeElement;
  //   if (columnaElement) {
  //     columnaElement.classList.add('ganador');
  //   }
  // }


  revancha() {
    if (this.nombreStoraage == this.resultadoJuego.jugador2.nombre) {
      this.socketInvitado = this.resultadoJuego.jugador2.socket;
    } else {
      this.socketInvitado = this.resultadoJuego.jugador1.socket;
    }

    this.resultadoJuego.modoJuego


    this.navCtrl.navigateForward('/menu-principao');


    // this.socketWebService.emitEvent(
    //   {
    //     opcion: 'revancha',
    //     sala: this.resultadoJuego.jugador1.sala,
    //   })





    // Obtener el resultado del juego al cargar la página
    this.resultadoJuego = this.guardarResultadosService.obtenerResultados();

    // Verificar si el modo de juego es "solo" o "pareja"
    if (this.resultadoJuego.modoJuego === 'solo') {
      // 'edgar  ojo ojo'

      //doka  this.socketWebService.emitEvent({ opcion: 'jugarSolo', nombreJugador: this.resultadoJuego.jugador1.nombre, salaId: this.sala })

    } else if (this.resultadoJuego.modoJuego === 'pareja') {
      console.log('El juego es en pareja');
      console.log('Nombre del jugador 1:', this.resultadoJuego.jugador1.nombre);
      console.log('Puntos del jugador 1:', this.resultadoJuego.jugador1.puntos);
      console.log('Nombre del jugador 2:', this.resultadoJuego.jugador2.nombre);
      console.log('Puntos del jugador 2:', this.resultadoJuego.jugador2.puntos);
    } else {
      console.log('Modo de juego no reconocido');
    }
  }


  sonidosdelJuego() {

    var soundid = new Howl({
      //src: ['assets/icons-audios/nivel' + this.nivel + '/audios/' + this.listaTarjetas[index].nombre + '.wav'],
      src: ['assets/sonidos/Ganó.wav'],
      // src: ['assets/icons-audios/nivel1/audios/HizoPareja.wav'],
      volume: 1.9,
      onend: () => {
      }
    });

    soundid.play()
  }

  ngAfterViewInit() {
    if (this.ganadorIndex === 0 && this.jugador1Ref) {
      this.renderer.addClass(this.jugador1Ref.nativeElement, 'ganador');
    } else if (this.ganadorIndex === 1 && this.jugador2Ref) {
      this.renderer.addClass(this.jugador2Ref.nativeElement, 'ganador');
    }
  }

  /* -------------------------------------------------------------------- --------------
                          recibir informacion que envia el backend
  ---------------------------------------------------------------------------------- */
  // recibirInformacionBackend() {
  //   this.socketWebService.outEven.subscribe(datos => {
  //     this.sOption = datos.opcion;
  //     switch (this.sOption) {

  //       case 'esperando-Rta-Revacha':  // 'envaimos la revancha y estamos esperando a que consteste '
  //         //  alert('enviamos la  y estamos esperando a que acepten ')
  //         console.log('envaimos la revancha y estamos esperando a que consteste ', datos);

  //         break;

  //       case 'revancha-no-aceptada':

  //         // this.platform.ready().then(() => {
  //         //   this.currentURL = window.location.href;
  //         // });

  //        // this.navCtrl.navigateForward('/menu-principal');

  //         break;


  //       default:
  //         break;
  //     }
  //   })

  // }


  // aceptoRevancha() {
  //   this.socketWebService.emitEvent(
  //     {
  //       opcion: 'Revancha-Aceptda',
  //       nombreInvita: this.nombreStoraage,
  //       sala: this.sala,
  //     })


  // }

  /* 
    ----------------------------------------------------------------------------------------
                                    Alerta confirmar
    -----------------------------------------------------------------------------------------
  */
  async presentAlertConfirm(message: string, opc: number, nombre: string, socketId: string) {
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
                //this.invitarAlJuego(nombre, socketId);
                break;

              case 1: // acepto la invitacion a jugar
                //   this.aceptoRevancha();
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
          }
        }

      ]
    });

    await alert.present();
  }



}
