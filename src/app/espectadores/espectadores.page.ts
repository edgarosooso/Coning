
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketWebService } from '../services/socket-web.service';
import { NavController } from '@ionic/angular';

import { Tarjeta } from '../../app/models/tarjeta.model';
import { SeleccionService } from '../services/seleccion.service';
import { Howl } from 'howler';
// Ejemplo en un componente o servicio Angular
import { ClickEventData } from '../models/click-event-data.model';
import { GuardarResultadosService } from '../services/guardar-resultados.service';


@Component({
  selector: 'app-espectadores',
  templateUrl: './espectadores.page.html',
  styleUrls: ['./espectadores.page.scss'],
})
export class EspectadoresPage implements OnInit {

  private clickSubscription: Subscription | undefined;
  private espectadorSubscription: Subscription | undefined;
  private salioDelJuegoSubscription: Subscription | undefined;


  ocultarBotones: any[] = [];
  ocultarImagen: any[] = [];

  nombreJugador: string = '';
  isLoading: boolean = true;

  constructor(
    private socketWebService: SocketWebService,
    private navCtrl: NavController,
    private seleccionService: SeleccionService,
    private guardarResultadosService: GuardarResultadosService,

  ) {
    this.nombreJugador = 'jugador';
    this.imgAvatarJugador1 = '../assets/img/gif/Ficha1.gif'
    this.imgAvatarJugador2 = '../assets/img/gif/avatarPc.gif'
    this.juego();
  }



  // src/app/some-page/some-page.component.ts
  lista: any[] = [];  // Inicializando como un arreglo vacío

  ngOnInit() {

    // this.lista = this.getListaInicial(); // Supón que tienes una función para obtener los datos iniciales
    this.sonarAudio(true, 0);

    setTimeout(() => {
      this.isLoading = false;
    }, 2100);

    this.bgcolor = "#28ba62";
    this.bBloqueado = 0;
    this.nombreJugador = 'jugador';

    this.imprimirTablaConsole();


  }


  listaTarjetas: Tarjeta[] = []; // Usando la interfaz Tarjeta
  InicioElJuego: boolean = false;
  swUnaSolaVezEspera: boolean = true;
  nombreSala: string = '';

  Ico1: number = 0;
  Ico2: number = 0;

  displayTimeA = '';  // tiempo inicial formateado
  displayTimeB = this.displayTimeA;  // tiempo inicial formateado
  veces: number = 0;

  countdownSubscription: Subscription | undefined;

  usuario: string = '';

  timeoutRef: any;


  showText = false;

  mensajeSistema = 'Texto inicial';
  manoUrl = "../../assets/img/manos/sigues.png";

  imagenes = ['../../assets/cards/Greekboton1.png',
    '../../assets/cards/Greekboton2.png',
    '../../assets/cards/Greekboton3.png',
  ];

  nombreJugador1: string = '';
  nombreArchivoAsonar: string = ''
  //rangoNumeros: number[] = [];
  miTurno: boolean = false;
  //condicion: boolean = true; // Por ejemplo, inicia con valor true

  botonRandomize: number = -1;

  Ipos: number = 0;
  jugandoMaquina: boolean = false;
  juegaHumano: boolean = true;
  socketUsuario: string = '';


  botonesAbierto: any[] = [];
  botonesAbiertoBackend: any[] = [];
  parejasHechas: number[] = [];
  //ficha: string = '';
  juegoTerminado: boolean = false;
 
  randomizado: number = 0;
  imgAvatarConectado: string = '';
  clicUsuario: number = 0;
  hideButton: boolean[] = [];
  hideImage: boolean[] = []; // Inicializa hideImage como un array vacío
  imageTimeouts: any[] = []; // Array para almacenar los identificadores de temporizador
  image: any[] = []
  //turno: boolean;
  hora: string = '';
  nivel: number = 0;
  loading: any;
  sOption: string = '';

  contador: number = 0;
  indexUnoAux: number = 0;
  indexDosAux: number = 0;
  puntosA: number = 0;
  puntosB: number = 0;
  borrados: number = 0;
  total_Palabras: number = 0;
  swJugadorInicia: number = 0;
  timerID: any;
  nombreJugador2: string = '';
  nombreJugador_2: string = ''
  rutaImagen: string = ''
  sSocket: string = ''
  numeroJugadores: string = ''
  bgcolor: string = ''
  bBloqueado: number = 0;
  totalNiveles: number = 0;
  nombreArchivo: string = ''
  imgAvatarJugador1: string = '';
  imgAvatarJugador2: string = '';
  nombreImagen: string = '';
  nombreImagenDos: string = '';
  indensayo: number = 1;

  /* --------------------------------------------------------------------------------------------------
                      RECIBIR INFORMACION DEL BACKEND
  -------------------------------------------------------------------------------------------------*/
  ngOnDestroy() {
    // Desuscribirse de todas las suscripciones activas para evitar fugas de memoria
    this.clickSubscription?.unsubscribe();
    this.espectadorSubscription?.unsubscribe();
    this.salioDelJuegoSubscription?.unsubscribe();

  }

  /* ----------------------------------------------------------------------------------
                            validar click del boton
  ---------------------------------------------------------------------------------- */
  hizoClickBotones(botonNumero: number, nombre: string) {

    this.sonidosdelJuego("Boton.wav");

    this.ocultarBotones[botonNumero] = true;
    this.image[botonNumero] = this.rutaImagen + nombre + ".png"

    this.listaTarjetas[botonNumero].imagen = this.rutaImagen + nombre + ".png')"

    this.fadeButton(botonNumero)
  }


  toggleText(valor: boolean, texto: string, pareSigua: boolean) {
    this.showText = valor;
    this.mensajeSistema = texto;
    if (pareSigua === true) {
      this.manoUrl = "../../assets/img/manos/sigues.png";
      this.imagenes = ['../../assets/cards/Greekboton1.png',
        '../../assets/cards/Greekboton2.png',
        '../../assets/cards/Greekboton3.png',
      ];

    } else {
      this.manoUrl = "../../assets/img/manos/espera.png";
      this.imagenes = ['../../assets/img/gif/dorsoTarjetas.png'];
    }
    setTimeout(() => {
      //this.showText = !this.showText;
      this.showText = false;
    }, 1000);
  }



  /*----------------------------------------------------------------------------------------
                             SOLICITAR EL JUEIGO 
  -----------------------------------------------------------------------------------------*/
  juego() {
    this.clickSubscription?.unsubscribe(); // Limpieza de suscripción
    this.clickSubscription = this.socketWebService.onEvent('click').subscribe(data => {
      console.log('------------llego el juego:', data);
      // Manejar la respuesta a la invitación aquí
      this.recibirClick(data);
      // this.InicioElJuego = true;
      // this.swUnaSolaVezEspera = true;
      // this.displayTimeB = this.displayTimeA;
      // this.toggleText(true, "Juegas tú (abre dos tarjetas)", true);
    });


    this.espectadorSubscription?.unsubscribe(); // Limpieza de suscripción
    this.espectadorSubscription = this.socketWebService.onEvent('espectador').subscribe(data => {
      console.log('------------llego el espectador:', data);
      // Manejar la respuesta a la invitación aquí

      this.recibirJuego(data);

      // this.InicioElJuego = true;
      // this.swUnaSolaVezEspera = true;
      // this.displayTimeB = this.displayTimeA;
      // this.toggleText(true, "Juegas tú (abre dos tarjetas)", true);

    });
  }



  /*----------------------------------------------------------------------------------------
                             SALIO DEL JUEGO 
  -----------------------------------------------------------------------------------------*/
  emitirSalidadDeJuego() {
    this.salioDelJuegoSubscription?.unsubscribe(); // Limpieza de suscripción
    this.salioDelJuegoSubscription = this.socketWebService.onEvent('salio-De-Juego').subscribe(data => {
    });

    this.socketWebService.emitEvent('salio-De-Juego', {
    });
  }

  // Se ejecuta justo antes de que la página comience a dejar de ser visible
  ionViewWillLeave() {
    console.log('Estoy dejando la página...');

    this.emitirSalidadDeJuego();

  }


  recibirClick(datos: any) {

    console.table(datos)

    if (datos.clics == 1) {

      this.ocultarBotones[0] = false; //oculta el boton
      this.listaTarjetas[0].imagen = this.rutaImagen + datos.nombreImagenUno + ".png')"
      this.sonarAudio(false, datos.botonIndexUno);
      //   this.nombreImagen = datos.nombreImagenUno;

      this.ocultarBotones[datos.botonIndexUno] = true; //oculta el boton
      this.image[datos.botonIndexUno] = this.rutaImagen + datos.nombreImagenUno + ".png"
      this.listaTarjetas[datos.botonIndexUno].imagen = this.rutaImagen + datos.nombreImagenUno + ".png')"
      //  this.nombreImagen = datos.nombreImagenUno;
      this.fadeButton(datos.botonIndexUno);
      // this.secuenciaCartas(datos.botonIndexUno, datos.nombreImagenUno);
    }

    if (datos.clics == 2) {
      this.ocultarBotones[datos.botonIndexDos] = true; //oculta el boton
      this.image[datos.botonIndexDos] = this.rutaImagen + datos.nombreImagenDos + ".png"
      this.listaTarjetas[datos.botonIndexDos].imagen = this.rutaImagen + datos.nombreImagenDos + ".png')"
      this.nombreImagen = datos.nombreImagenDos;
      this.fadeButton(datos.botonIndexDos);
      this.listaTarjetas[datos.botonIndexDos].imagen = this.rutaImagen + datos.nombreImagenDos + ".png')"
      this.sonarAudio(false, datos.botonIndexDos);
      this.nombreImagen = datos.nombreImagenDos;

      this.puntosA = datos.puntosA;
      this.puntosB = datos.puntosB;
      this.ocultarBotones[datos.botonIndexUno] = false; //mostar el boton
      this.ocultarBotones[datos.botonIndexDos] = false; //mostar  el boton

      setTimeout(() => {
        if (datos.hizoPareja == false) { //no hizo parjea 

          this.ocultarBotones[datos.botonIndexUno] = false; //mostar el boton
          this.ocultarBotones[datos.botonIndexDos] = false; //mostar  el boton

          this.hideButton[datos.botonIndexUno] = false;
          this.hideButton[datos.botonIndexDos] = false;
          this.hideImage[datos.botonIndexUno] = true;
          this.hideImage[datos.botonIndexDos] = true;

        }

        if (datos.hizoPareja == true) { // hizo parjea 

          this.parejasHechas[this.Ipos] = datos.botonIndexUno;
          this.Ipos++;
          this.parejasHechas[this.Ipos] = datos.botonIndexDos;
          this.Ipos++;
          this.sonidosdelJuego("HizoPareja.wav");
          this.hideButton[datos.botonIndexUno] = true;
          this.hideButton[datos.botonIndexDos] = true;
          this.hideImage[datos.botonIndexUno] = true;
          this.hideImage[datos.botonIndexDos] = true;
          //  this.eliminarParejaPorValor(datos.botonIndexUno, datos.botonIndexDos);
        }
        //  this.juegoTerminado = datos.juegoTerminado;
        if (datos.juegoTerminado == true) {

          // Suponiendo que esto está dentro de algún método en un componente
          this.finalizarJuego(datos.nombreJugadorA, datos.puntosA, datos.nombreJugadorB, datos.puntosB, datos.Ico1,
            datos.Ico2, datos.socket1, datos.socket2, datos.sala, datos.urlAvatar1,
            datos.urlAvatar2, datos.resultadofinal1, datos.resultadofinal2
          );
          localStorage.setItem('sala', datos.sala);

        } else {


          console.log("edgar osorio  *as/das/saf/as-d asd ", datos.turno);

          this.miTurno = datos.turno;
          //console.log("mi turno", this.miTurno)
          if (datos.turno !== true) {
            this.toggleText(true, "Espera", false);
          } else {
            this.toggleText(true, "Juegas tú", true);
          }
        }

      }, 1000);

    }

  }





  recibirJuego(datos: any) {
    console.clear();
    console.log("asdfasdf asdfas-d -asdf-asd-fa s-d*as-d* -asd -*asd-a s");
    console.table(datos);

    //  this.limpiarValores()
    // this.parejasHechas = [];

    this.imgAvatarJugador1 = datos.urlAvatar1
    this.imgAvatarJugador2 = datos.urlAvatar2
    this.nombreJugador1 = datos.nombreJugador1;
    this.nombreJugador2 = datos.nombreJugador2;
    this.puntosA = datos.puntosA;
    this.puntosB = datos.puntosB;

    this.miTurno = datos.turno;
    this.nivel = datos.nivel;
    this.rutaImagen = "url('../../../assets/icons-audios/nivel" + this.nivel + "/icons/";
 

    this.listaTarjetas = [];
    this.listaTarjetas = datos.tarjetas;


    this.listaTarjetas = datos.tarjetas.map((tarjeta: any) => ({
      nombre: tarjeta.nombre,
      significado: tarjeta.significado,
      imagen: this.rutaImagen + tarjeta.nombre + ".png"
    }));

    // // this.imprimirTablaConsole();
    // this.nombreSala = datos.sala;
    // this.hora = datos.hora;
    for (var i = 0; i < this.listaTarjetas.length; i++) {
      this.ocultarBotones[i] = true;
      //this.listaTarjetas[i].imagen = null;
      //edgar this.rangoNumeros.push(i);
    }

    // this.rangoNumeros = [];
    // this.rangoNumeros = Array.from({ length: 20 }, (_, index) => index);
    // for (var i = 0; i < 20; i++) {
    //   this.rangoNumeros.push(i);
    // }




    this.hideButton = datos.hideButton

    console.table(this.hideButton);

    console.log("datos del hiden ")
    //console.table(this.hideButton);

    this.hideImage = new Array(this.listaTarjetas.length).fill(true); // Inicializa hideImage correctamente
    this.Ico1 = datos.Ico1;
    this.Ico2 = datos.Ico2;



  }


  ensayodoka() {

    this.hideButton[0] = true;
    this.hideImage[0] = false;

  }


  /*-----------------------------------------------------------------------------------
                          HACER CLICK EN LAS CARTAS
  -----------------------------------------------------------------------------------*/
  async secuenciaCartas(index: number, nombre: string) {
    await this.clickearCarta(index, nombre);

  }

  /*-----------------------------------------------------------------------------------------------
                              HACER CLICK EN LOS BOTONES
  ------------------------------------------------------------------------------------------------*/
  // Ejemplo de función en un componente de Ionic/Angular
  clickearCarta(index: number, nombre: string): Promise<void> {
    return new Promise(resolve => {
      this.timeoutRef = setTimeout(() => {
        this.hizoClickBotones(index, nombre);
        resolve();
      }, 500);
    });
  }


  fadeButton(index: number) {
    this.hideButton[index] = true; //reproducir animacion
    this.hideImage[index] = !this.ocultarBotones[index];  // Mostrar la imagen correspondiente al botón clicado true
    setTimeout(() => {
      this.fadeImage(index)
    }, 500);
  }

  fadeImage(index: number): void {
    if (this.imageTimeouts[index]) {
      clearTimeout(this.imageTimeouts[index]);
    }
    this.hideImage[index] = false; // Mostrar la imagen correspondiente al botón clicado

    this.imageTimeouts[index] = setTimeout(() => {
    }, 800);
  }


  /* ----------------------------------------------------------------------------------
                          sonar el audio de las palabras
  ---------------------------------------------------------------------------------- */

  sonarAudio(splass: boolean, index: number) {

    if (splass) {
      this.nombreArchivoAsonar = "../../assets/sonidos/splash.wav";
    } else {
      this.nombreArchivoAsonar = `assets/icons-audios/nivel${this.nivel}/audios/${this.listaTarjetas[index].nombre}.wav`;
    }

    var sound = new Howl({
      src: this.nombreArchivoAsonar,
      volume: 0.5,
      onend: () => {
      }
    });
    sound.play()
  }



  ensayo(index: number) {
    if (index == 1) {
      this.imagenes = ['../../assets/img/gif/dorsoTarjetas.png'];
    } else {
      this.imagenes = ['../../assets/img/gif/Greekboton1.png',
        '../../assets/img/gif/Greekboton2.png',
        '../../assets/img/gif/Greekboton3.png',
        '../../assets/img/gif/Greekboton4.png',
        '../../assets/img/gif/Greekboton5.png',
        '../../assets/img/gif/Greekboton6.png',
        '../../assets/img/gif/Ficha2.gif',
      ];
    }
  }



  imprimirTablaConsole() {
    console.clear();
    console.log('x1b[32m LISTA DE TARJETAS', 'color: fuchsia; font-weight: bold;');
    console.table(this.listaTarjetas); // Para una vista tabular
    console.log('\x1b[36m  BOTONES ABIERTOS FRON END');
    console.table(this.botonesAbierto); // Para una vista tabular
  }

  sonidosdelJuego(nombreAudio: string) {
    var soundid = new Howl({
      //src: ['assets/icons-audios/nivel' + this.nivel + '/audios/' + this.listaTarjetas[index].nombre + '.wav'],
      src: ['assets/sonidos/' + nombreAudio],
      // src: ['assets/icons-audios/nivel1/audios/HizoPareja.wav'],
      volume: 1.9,
      onend: () => {
      }
    });

    soundid.play()
  }


  /*
      ----------------------------------------------------------------------------------------
                                    JUEGO FINALIZADO
      -----------------------------------------------------------------------------------------*/


  finalizarJuego(jugador1: string, puntosA: number, jugador2: string, puntosB: number, iCo1: number, iCo2: number, socket1: string, socket2: string, sala: string
    , urlAvatar1: string, urlAvatar2: string, resultadofinal: string, resultadofina2: string

  ) {

    const resultado = {
      jugador1: {
        nombre: jugador1,
        puntos: puntosA,
        iCo: iCo1,
        socket: socket1,
        sala: sala,
        urlAvatar: urlAvatar1,
        resultadofinal: resultadofinal,
      },
      jugador2: {
        nombre: jugador2,
        puntos: puntosB,
        iCo: iCo2,
        socket: socket2,
        sala: sala,
        urlAvatar: urlAvatar2,
        resultadofinal: resultadofina2,
      }
    };

    // Guardar el resultado del juego
    this.guardarResultadosService.guardarResultados(resultado);



    // Navegar a la página de juego finalizado
    //  this.router.navigate(['/terminojuego']);

    this.navCtrl.navigateForward('/juego-terminado');


  }




}
