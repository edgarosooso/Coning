/*
ionViewWillEnter: Se dispara cuando la página está a punto de entrar y convertirse en la página activa.
ionViewDidEnter: Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.
ionViewWillLeave: Se activa cuando la página está a punto de dejar de ser la página activa.
ionViewDidLeave: Se dispara después de que la página ha dejado de ser visible.
*/
/* edgar osorio */
import { AuthService } from '../services/auth.service';

import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { SocketWebService } from '../services/socket-web.service';
import { Subscription } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { ConexionesService } from '../services/conexiones.service';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [
    'home.page.scss',
    'home.page1.scss',
    'home.page2.scss',
    'home.page3.scss',
  ],
})
export class HomePage implements OnInit {
  @ViewChild('inputNombre', { static: false, read: ElementRef }) inputNombre:
    | ElementRef
    | undefined;
  private espectadorSubscription: Subscription | undefined;
  private quitarJugadoresSubscription: Subscription | undefined;
  //private enviarjugadoresSubscription: Subscription | undefined;

  //  private informacionSalasSubscription: Subscription | undefined;

  constructor(
    private socketWebService: SocketWebService,
    private navCtrl: NavController,
    private conexionesService: ConexionesService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('asdasd ----- -- - --- -- -e-dgar ');

    // Si la autenticación es exitosa, conecta el socket.
    //this.socketWebService.connect();
    this.buscarNombreAvatar(localStorage.getItem('Jugador1') || '');
    //localStorage.setItem("id", '-1');

    //  this.iniciarEscuchaDeInvitaciones();

    const icoTablaString = localStorage.getItem('icoTabla');
    // Convertir el valor a número, manejando el caso null
    this.ico = icoTablaString !== null ? Number(icoTablaString) : 0;
  }

  ngOnDestroy() {
    // Desuscribirse de todas las suscripciones activas para evitar fugas de memoria
    this.espectadorSubscription?.unsubscribe();
    this.quitarJugadoresSubscription?.unsubscribe();
    // this.enviarjugadoresSubscription?.unsubscribe();
  }

  /* --------------------------------------------------------------- ///
                                  VARIABLES
  /// --------------------------------------------------------------- */

  clave: string = '';
  usuario: string = '';
  resultados: any[] = [];
  ico: number = 0;
  loading: any;
  showLogin: boolean = true;
  username: string = '';
  password: string = '';
  ingreso: string = 'no';

  onLine() {
    this.navCtrl.navigateRoot('/sala-espera');
  }

  nombreSala: string = '';
  //rutaAvatar: string = '../../assets/img/gif/Ficha1.gif';

  rutaAvatar: string = '../../assets/avatar/eli.png';

  nombre: string = '';

  juadorContrIA() {
    //localStorage.setItem("icoTabla", '70');
    localStorage.setItem('icoTablaMaquina', '3700');
    localStorage.setItem('nombreJugador2', 'maquina');
    localStorage.setItem('avatarjugador2', '../assets/avatar/avatarPc.gif');
    this.navCtrl.navigateForward('/jugador-contra-ia');
  }

  onKeyUp(event: KeyboardEvent) {
    this.buscarNombreAvatar(this.nombre);
    // Aquí puedes realizar cualquier acción que desees al soltar una tecla
  }

  continueAsGuest() {
    // Lógica para continuar como invitado
    console.log('Continuar como invitado');
    this.buscarNombreAvatar('invitado');

    localStorage.setItem('ingreso', 'si');
    this.showLogin = false;
  }

  /*----------------------------------------------------------------------------------------
                                ESPECTADOR
  -----------------------------------------------------------------------------------------*/
  espectador(nombre: string) {
    this.espectadorSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior

    this.espectadorSubscription = this.socketWebService
      .onEvent('espectador')
      .subscribe((datos) => {
        console.log('Respuesta del servidor al espectador:', datos);
        localStorage.setItem('Jugador1-rutaAvatar', datos.rutaAvatar);
        localStorage.setItem('Jugador1-socket', datos.socket);

        // Aquí podrías llamar a otra función que maneje la lógica después del ingreso
        this.emitirEspectadpr(datos);
      });

    this.socketWebService.emitEvent('espectador', {
      sala: 'salaedgar',
      nombreEspectador: nombre,
    });
  }

  /*----------------------------------------------------------------------------------------
                                QUITAR JUGADOR
  -----------------------------------------------------------------------------------------*/
  quitarJugador(nombre: string) {
    this.quitarJugadoresSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior
    this.quitarJugadoresSubscription = this.socketWebService
      .onEvent('quitar-Jugador')
      .subscribe((datos) => {});

    this.socketWebService.emitEvent('quitar-Jugador', {
      nombre: nombre,
    });
  }

  emitirEspectadpr(datos: any) {
    console.table(datos);
  }

  jugadoresEnSalas() {
    localStorage.setItem('nombreJugador2', 'maquina');
    localStorage.setItem('avatarjugador2', '../assets/avatar/avatarPc.gif');

    this.navCtrl.navigateRoot('/jugadores-en-sala');
  }

  ionViewWillEnter() {
    this.socketWebService.emitEvent('enviar-jugadores', {});
  }

  ionViewDidEnter() {
    this.ingreso = localStorage.getItem('ingreso') || ''; // Obtener el valor de localStorage y asignar una cadena vacía si es null
    this.showLogin = this.ingreso === 'si' ? false : true;

    setTimeout(() => {
      if (this.inputNombre) {
        this.inputNombre.nativeElement.focus();
        //this.focusNombre();
      }
    }, 100);
  }

  // -------------------------------------- VALIDAR LOGIN  -----------------------------------

  login(user: string, pass: string) {
    this.authService.consultarLogin(user, pass).subscribe({
      next: (response) => {
        if (
          this.authService.estaAutenticado() &&
          response &&
          response.userData
        ) {
          // Los datos del usuario ya están en response.userData
          this.rutaAvatar = response.userData.rutaAvatar;
          this.nombre = response.userData.nombre;
          this.ico = response.userData.Ico;
          this.showLogin = false;
        } else {
          this.presentAlert('Usuario o contraseña incorrectos.');
          this.rutaAvatar = '../../assets/avatar/eli.png';
          this.nombre = '';
          this.ico = 0;
        }
      },
      error: (error) => {
        this.presentAlert(
          'Error al iniciar sesión. Por favor, inténtelo de nuevo. ' +
            JSON.stringify(error)
        );
        this.rutaAvatar = '../../assets/avatar/eli.png';
        this.nombre = '';
        this.ico = 0;
      },
    });
  }

  // login(usuario: string, clave: string) {
  //   // Inicialización del estado de inicio de sesión
  //   localStorage.setItem('id', '-1');
  //   localStorage.setItem('icoTabla', '0');
  //   localStorage.setItem('ingreso', 'no');

  //   this.rutaAvatar = '../../assets/avatar/' + usuario + '.png';

  //   if (!usuario || !clave) {
  //     this.presentAlert('Ingrese usuario y clave.');
  //     return; // Salir de la función si las credenciales son inválidas
  //   }

  //   this.conexionesService.getlogin<any>(usuario, clave).subscribe({
  //     next: (datos) => {
  //       if (datos && datos.length > 0) {
  //         const usuarioData = datos[0]; // Obtener el primer resultado

  //         // Actualizar el estado de la aplicación con los datos del usuario
  //         this.rutaAvatar = usuarioData.rutaAvatar;
  //         this.nombre = usuarioData.nombre;
  //         this.ico = usuarioData.Ico;
  //         this.showLogin = false;

  //         // Almacenar datos en localStorage (considerar alternativas más seguras para datos sensibles)
  //         localStorage.setItem('id', usuarioData.ID);
  //         localStorage.setItem('icoTabla', usuarioData.Ico);
  //         localStorage.setItem('Jugador1', usuarioData.nombre);
  //         localStorage.setItem('avatar1', usuarioData.rutaAvatar);
  //         localStorage.setItem('ingreso', 'si');
  //         localStorage.setItem('viewHands', usuarioData.ViewAviso);
  //         localStorage.setItem('nombreJugador1', usuarioData.nombre);
  //       } else {
  //         // Manejar el caso de credenciales incorrectas
  //         this.presentAlert('Usuario o contraseña incorrectos.');
  //         this.rutaAvatar = '../../assets/avatar/eli.png'; // Imagen por defecto en caso de error
  //         this.nombre = '';
  //         this.ico = 0;
  //       }
  //     },

  //     error: (error) => {
  //       this.presentAlert(
  //         'Error al iniciar sesión. Por favor, inténtelo de nuevo. ' +
  //           JSON.stringify(error)
  //       );

  //       this.rutaAvatar = '../../assets/avatar/eli.png';
  //       this.nombre = '';
  //       this.ico = 0;
  //     },
  //   });
  // }

  // login(usuario: string, clave: string) {
  //   localStorage.setItem('id', '-1');
  //   localStorage.setItem('icoTabla', '0');
  //   localStorage.setItem('ingreso', 'no');

  //   this.rutaAvatar = '../../assets/avatar/' + usuario + '.png';

  //   if (!usuario || !clave) {
  //     // no existe
  //     this.presentAlert('Ingrese usuario y clave');
  //   } else {
  //     this.conexionesService
  //       .getlogin<any>(usuario, clave)
  //       .subscribe((datos) => {
  //         this.resultados = [];
  //         if (datos.length > 0) {
  //           this.presentAlert('valor de variable ');

  //           this.showLogin = false;
  //           this.resultados = datos;

  //           console.table(datos);

  //           console.log(this.resultados[0].rutaAvatar);

  //           this.rutaAvatar = this.resultados[0].rutaAvatar;
  //           this.nombre = this.resultados[0].nombre;
  //           this.ico = this.resultados[0].Ico;

  //           localStorage.setItem('id', this.resultados[0].ID);
  //           localStorage.setItem('icoTabla', this.resultados[0].Ico);
  //           localStorage.setItem('Jugador1', this.nombre);
  //           localStorage.setItem('avatar1', this.rutaAvatar);
  //           localStorage.setItem('ingreso', 'si');

  //           localStorage.setItem('viewHands', this.resultados[0].ViewAviso);

  //           this.showLogin = false;

  //           localStorage.setItem('nombreJugador1', this.nombre);
  //         } else {
  //           this.presentAlert('clave o usuario incorrecto');
  //           //this.rutaAvatar = '../../assets/img/gif/Ficha1.gif';

  //           this.rutaAvatar = '../../assets/avatar/eli.png';

  //           this.nombre = '';
  //           this.ico = 0;
  //         }
  //       });
  //   }
  // }

  buscarNombreAvatar(nombreABuscar: string): boolean {
    nombreABuscar = nombreABuscar.toLowerCase();

    const nombres = [
      'eli',
      'sofia',
      'nando',
      'thismen',
      'sebaso',
      'doka',
      'pensara',
      'maria',
      'paola',
      'leidy',
      'laura',
      'samir',
      'sebas',
      'aleja',
      'andy',
      'marian',
      'lauramarcela',
      'antonela',
      'luciana',
    ];

    const encontrado = nombres.includes(nombreABuscar); // Convertir a minúsculas para una comparación insensible a mayúsculas y minúsculas

    if (encontrado) {
      console.log(`El nombre "${nombreABuscar}" se encuentra en el array.`);
      this.rutaAvatar = '../../assets/avatar/' + nombreABuscar + '.png';
      localStorage.setItem('Jugador1', nombreABuscar);
      localStorage.setItem('avatar1', this.rutaAvatar);
      localStorage.setItem('usuario', nombreABuscar);
    } else {
      this.rutaAvatar = '../../assets/avatar/avatarPredeterminado.png';

      localStorage.setItem('Jugador1', 'jugador1');
      localStorage.setItem('avatar1', this.rutaAvatar);
      localStorage.setItem('usuario', 'jugador1');
      this.ico = 70;
    }

    this.nombre = nombreABuscar;

    //this.quitarJugador(this.nombre);

    return encontrado;
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'my-custom-class',
      message,
    });
    return this.loading.present();
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Dokasoft',
      //subHeader: '',
      message: msg,
      //backdropDismiss: false,
      //buttons: ['OK']
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'active-button',
          handler: () => {
            // Acciones adicionales cuando se hace clic en el botón OK
          },
        },
      ],
    });

    await alert.present();
  }
}
