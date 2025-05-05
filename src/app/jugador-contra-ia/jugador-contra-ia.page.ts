/*
ionViewWillEnter: Se dispara cuando la página está a punto de entrar y convertirse en la página activa.
ionViewDidEnter: Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.
ionViewWillLeave: Se activa cuando la página está a punto de dejar de ser la página activa.
ionViewDidLeave: Se dispara después de que la página ha dejado de ser visible.
*/

import { Subscription } from 'rxjs';
import { SocketWebService } from '../services/socket-web.service';
import { Tarjeta } from '../../app/models/tarjeta.model';
import { SeleccionService } from '../services/seleccion.service';
import { Howl } from 'howler';
// Ejemplo en un componente o servicio Angular
import { ClickEventData } from '../models/click-event-data.model';
import { GuardarResultadosService } from '../services/guardar-resultados.service';
import { ServicioDeTemporizador } from '../services/timer.service.service';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { ConexionesService } from '../services/conexiones.service';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jugador-contra-ia',
  templateUrl: './jugador-contra-ia.page.html',
  styleUrls: [
    './jugador-contra-ia.page.scss',
    './jugador-contra-ia.page1.scss',
    './jugador-contra-ia.page2.scss',
  ],
})
export class JugadorContraIaPage implements OnInit {
  private eventSubscription: Subscription | undefined;
  tiempoRestante: number | undefined;
  ocultarBotones: any[] = [];
  ocultarImagen: any[] = [];
  private ingresoSubscription: Subscription | undefined;
  private invitacionSubscription: Subscription | undefined;
  private juegoSubscription: Subscription | undefined;
  private clickSubscription: Subscription | undefined;
  private timerSubscription: Subscription | undefined;
  private salioDelJuegoSubscription: Subscription | undefined;

  nombreJugador: string = '';
  isLoading: boolean = true;
  online: string = '';
  idTabla: number = 0;
  icoTabla: number = 0;
  Ico1: number = 0;
  Ico2: number = 0;

  datosDoka: string = '';

  constructor(
    private socketWebService: SocketWebService,
    private navCtrl: NavController,
    private seleccionService: SeleccionService,
    private guardarResultadosService: GuardarResultadosService,
    private servicioDeTemporizador: ServicioDeTemporizador,
    private renderer: Renderer2,
    private platform: Platform,
    private router: Router,
    private conexionesService: ConexionesService
  ) {}

  // src/app/some-page/some-page.component.ts
  lista: any[] = []; // Inicializando como un arreglo vacío

  ionViewDidEnter() {
    //Se ejecuta cuando la página ha entrado completamente y ahora es la página activa.

    this.nombreJugador1 = localStorage.getItem('Jugador1') || 'jugador1';
    this.imgAvatarJugador1 =
      localStorage.getItem('avatar1') ||
      '../../assets/avatar/avatarPredeterminado.png';
    this.nombreJugador2 = localStorage.getItem('nombreJugador2') || 'maquina';
    this.imgAvatarJugador2 =
      localStorage.getItem('avatarjugador2') || '../assets/avatar/avatarPc.gif';
    this.imgAvatarConectado = localStorage.getItem('avatarConectado') || '';

    this.idTabla = Number(localStorage.getItem('id')) || -1;
    this.icoTabla = Number(localStorage.getItem('icoTabla')) || 70;

    this.ocultarMsgManos = this.getBooleanFromLocalStorage('viewHands');

    this.Ico2 = 3700;

    this.Ico1 = this.icoTabla;

    this.enviar();
  }

  getBooleanFromLocalStorage(key: string): boolean {
    const value = localStorage.getItem(key);
    return value === 'true';
  }

  ngOnInit() {
    this.lista = this.getListaInicial(); // Supón que tienes una función para obtener los datos iniciales
    console.log(this.lista);
    this.sonarAudio(true, 0);

    setTimeout(() => {
      this.isLoading = false;
    }, 2100);

    this.bgcolor = '#28ba62';
    this.bBloqueado = 0;
    this.nombreJugador = 'jugador';

    this.imprimirTablaConsole();

    if (this.InicioElJuego == true) {
      this.servicioDeTemporizador
        .verificarTemporizador1AlCero()
        .subscribe((alCero) => {
          if (alCero) {
            // Acción cuando el temporizador 1 llega a cero
            alert('jugador ' + this.nombreJugador1 + '  ha perdido por tiempo');
            this.servicioDeTemporizador.detenerTimer1();
            this.servicioDeTemporizador.detenerTimer2();
            //doka
          }
        });

      this.servicioDeTemporizador
        .verificarTemporizador2AlCero()
        .subscribe((alCero) => {
          if (alCero) {
            // Acción cuando el temporizador 2 llega a cero
            alert('jugador ' + this.nombreJugador2 + '  ha perdido por tiempo');
            this.servicioDeTemporizador.detenerTimer1();
            this.servicioDeTemporizador.detenerTimer2();
          }
        });
    }

    const viewHandsString: string | null = localStorage.getItem('viewHands');

    if (viewHandsString === 'true') {
      this.ocultarMsgManos = true;
    } else if (viewHandsString === 'false') {
      this.ocultarMsgManos = false;
    } else {
      this.ocultarMsgManos = true;
    }

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.regresar();
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.regresar();
  }

  regresar() {
    this.navCtrl.navigateRoot('/home');
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  listaTarjetas: Tarjeta[] = []; // Usando la interfaz Tarjeta
  InicioElJuego: boolean = false;
  swUnaSolaVezEspera: boolean = true;
  nombreSala: string = '';

  ocultarMsgManos: boolean = true;
  displayTimeA = ''; // tiempo inicial formateado
  displayTimeB = this.displayTimeA; // tiempo inicial formateado
  veces: number = 0;

  countdownSubscription: Subscription | undefined;

  usuario: string = '';

  timeoutRef: any;

  showText = false;

  mensajeSistema = 'Texto inicial';
  manoUrl = '../../assets/img/manos/sigues.png';

  imagenes = [
    '../../assets/cards/Greekboton1.png',
    '../../assets/cards/Greekboton2.png',
    '../../assets/cards/Greekboton3.png',
  ];
  showImage: boolean = false;

  nombreJugador1: string = '';
  nombreArchivoAsonar: string = '';
  rangoNumeros: number[] = [];
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
  image: any[] = [];
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
  nombreJugador_2: string = '';
  rutaImagen: string = '';
  sSocket: string = '';
  numeroJugadores: string = '';
  bgcolor: string = '';
  bBloqueado: number = 0;
  totalNiveles: number = 0;
  nombreArchivo: string = '';
  imgAvatarJugador1: string = '';
  imgAvatarJugador2: string = '';
  nombreImagen: string = '';
  nombreImagenDos: string = '';
  indensayo: number = 1;

  imgMatch: string = '../../assets/img/gif/Match.gif';
  //showImage: boolean = true;

  /* --------------------------------------------------------------------------------------------------
                      RECIBIR INFORMACION DEL BACKEND
  -------------------------------------------------------------------------------------------------*/
  ngOnDestroy() {
    // Desuscribirse de todas las suscripciones activas para evitar fugas de memoria
    this.ingresoSubscription?.unsubscribe();
    this.invitacionSubscription?.unsubscribe();
    this.juegoSubscription?.unsubscribe();
    this.clickSubscription?.unsubscribe();
    this.salioDelJuegoSubscription?.unsubscribe();
    // Detener el temporizador y cancelar la suscripción cuando el componente se destruya
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.servicioDeTemporizador.detenerTimer1();
    this.servicioDeTemporizador.detenerTimer2();
  }

  // Se ejecuta justo antes de que la página comience a dejar de ser visible
  ionViewWillLeave() {
    console.log('Estoy dejando la página...');

    this.emitirSalidadDeJuego();
  }

  ocultarManos() {
    this.conexionesService
      .UpdateViewAvisoById(this.idTabla)
      .subscribe((datos) => {
        localStorage.setItem('viewHands', 'false');
        this.ocultarMsgManos = false;
      });
  }

  /* ----------------------------------------------------------------------------------
                            validar click del boton
  ---------------------------------------------------------------------------------- */
  hizoClickBotones(usuario: boolean, botonNumero: number, nombre: string) {
    if (usuario == true) {
      //jugando usuario
      if (this.hideImage[botonNumero] && this.hideButton[botonNumero]) {
        return; // Detener la ejecución de la función aquí
      }

      this.clicUsuario++;
      if (this.clicUsuario > 2) {
        return;
      }
    }

    this.sonidosdelJuego('Boton.wav');

    this.ocultarBotones[botonNumero] = true;
    this.image[botonNumero] = this.rutaImagen + nombre + '.png';

    this.listaTarjetas[botonNumero].imagen =
      this.rutaImagen + nombre + ".png')";

    this.fadeButton(botonNumero);

    this.enviarClick(botonNumero, nombre);
  }

  toggleText(valor: boolean, texto: string, pareSigua: boolean) {
    this.showText = valor;
    this.mensajeSistema = texto;
    if (pareSigua === true) {
      this.manoUrl = '../../assets/img/manos/sigues.png';
      this.imagenes = [
        '../../assets/cards/Greekboton1.png',
        '../../assets/cards/Greekboton2.png',
        '../../assets/cards/Greekboton3.png',
      ];
    } else {
      this.manoUrl = '../../assets/img/manos/espera.png';
      this.imagenes = ['../../assets/img/gif/dorsoTarjetas.png'];
    }
    setTimeout(() => {
      //this.showText = !this.showText;
      this.showText = false;
    }, 1000);
  }

  manejarSeleccion() {
    const resultado = this.seleccionService.seleccionarDosNumeros(this.lista);
    console.log(resultado);
  }

  private getListaInicial(): any[] {
    // Retorna la lista inicial
    return [0, 1, 2, 3]; // Tu lógica para obtener la lista
  }

  /*----------------------------------------------------------------------------------------
                                ENVIAR INGRESO
  -----------------------------------------------------------------------------------------*/
  enviar() {
    this.ingresoSubscription?.unsubscribe(); // Desuscribirse de cualquier suscripción anterior

    this.ingresoSubscription = this.socketWebService
      .onEvent('ingreso')
      .subscribe((datos) => {
        console.log('Respuesta del servidor al ingreso:', datos);
        //this.imgAvatarConectado = datos.rutaAvatar;
        localStorage.setItem('jugador1', this.usuario);
        //      localStorage.setItem('Jugador1-rutaAvatar', datos.rutaAvatar);
        localStorage.setItem('Jugador1-rutaAvatar', this.imgAvatarConectado);
        localStorage.setItem('Jugador1-socket', datos.socket);
        // Aquí podrías llamar a otra función que maneje la lógica después del ingreso
        this.emitirInvitacion();
      });

    this.socketWebService.emitEvent('ingreso', {
      sala: this.nombreSala,
      jugador: this.nombreJugador1.trim(),
    });
  }

  /*----------------------------------------------------------------------------------------
                              ENVIAR INVITACION A JUGAR
  -----------------------------------------------------------------------------------------*/
  emitirInvitacion() {
    this.invitacionSubscription?.unsubscribe(); // Limpieza de suscripción
    this.invitacionSubscription = this.socketWebService
      .onEvent('invitar-A-jugar')
      .subscribe((data) => {
        console.log('--------------------   invitar a jugar:', data);
        this.emitirJuego(data.sala);
        this.nombreSala = data.sala;
        this.imprimirTablaConsole();
      });

    this.socketWebService.emitEvent('invitar-A-jugar', {
      jugador: this.nombreJugador1.trim(),
      sala: this.nombreSala,
      idTabla: this.idTabla,
      ico: this.icoTabla,
      urlAvatarJugador1: this.imgAvatarJugador1,
      // Puedes añadir más datos necesarios para la invitación
    });
  }

  /*----------------------------------------------------------------------------------------
                              ENVIAR CLICK
  -----------------------------------------------------------------------------------------*/
  enviarClick(botonNumero: number, nombre: string) {
    this.clickSubscription?.unsubscribe(); // Limpieza de suscripción
    this.clickSubscription = this.socketWebService
      .onEvent('click')
      .subscribe((datosClick) => {
        this.botonesAbierto = datosClick.botonesAbiertos;

        console.log(datosClick);

        this.validarJuegoEnParejas(datosClick);
        //this.validarJuegoEnParejas(data);
        this.imprimirTablaConsole();
      });

    this.socketWebService.emitEvent('click', {
      botonIndex: botonNumero,
      nombreImagen: nombre,
      sala: this.nombreSala,
      tiempoA: this.displayTimeA,
      tiempoB: this.displayTimeB,

      // Puedes añadir más datos necesarios para la invitación
    });
  }

  /*----------------------------------------------------------------------------------------
                             SOLICITAR EL JUEIGO 
  -----------------------------------------------------------------------------------------*/
  emitirJuego(sala: string) {
    this.juegoSubscription?.unsubscribe(); // Limpieza de suscripción

    this.juegoSubscription = this.socketWebService
      .onEvent('solicitar-juego')
      .subscribe((data) => {
        console.log('------------solictar el juego:', data);
        // Manejar la respuesta a la invitación aquí
        this.recibirJuego(data);

        setTimeout(() => {
          if (data.turno == true) {
            this.toggleText(
              this.ocultarMsgManos,
              'Juegas tú (abre dos tarjetas)',
              true
            );
          }
        }, 3000);

        this.InicioElJuego = true;
        this.swUnaSolaVezEspera = true;
        this.servicioDeTemporizador.reiniciarTemporizadores();
        this.startTimerA();
        this.displayTimeB = this.displayTimeA;
      });

    this.socketWebService.emitEvent('solicitar-juego', {
      jugador2: this.nombreJugador2,
      sala: sala,
      urlAvatarJugador2: this.imgAvatarJugador2,
      idTabla: this.idTabla,
      ico: this.icoTabla,

      // Puedes añadir más datos necesarios para la invitación
    });
  }

  /*----------------------------------------------------------------------------------------
                             SALIO DEL JUEGO 
  -----------------------------------------------------------------------------------------*/
  emitirSalidadDeJuego() {
    this.salioDelJuegoSubscription?.unsubscribe(); // Limpieza de suscripción
    this.salioDelJuegoSubscription = this.socketWebService
      .onEvent('salio-De-Juego')
      .subscribe((data) => {});

    this.socketWebService.emitEvent('salio-De-Juego', {});
  }

  recibirJuego(datos: any) {
    //this.imprimirTablaConsole()
    console.log(' llego el juego ', datos);
    //  this.limpiarValores()

    this.parejasHechas = [];
    // // localStorage.setItem('socket1', datos.socket1);
    // // localStorage.setItem('socket2', datos.socket2);
    // // localStorage.setItem('sala', datos.sala);

    this.Ico1 = datos.Ico1;
    //nooothis.Ico2 = datos.Ico2;
    this.imgAvatarJugador1 = datos.urlAvatar1;
    this.imgAvatarJugador2 = datos.urlAvatar2;
    this.miTurno = datos.turno;
    this.nombreJugador1 = datos.nombreJugador1;
    this.nombreJugador2 = datos.nombreJugador2;
    this.nivel = datos.nivel;
    this.rutaImagen =
      "url('../../../assets/icons-audios/nivel" + this.nivel + '/icons/';

    // this.listaTarjetas = [];
    // this.listaTarjetas = datos.tarjetas;

    this.listaTarjetas = datos.tarjetas.map((tarjeta: any) => ({
      nombre: tarjeta.nombre,
      significado: tarjeta.significado,
      imagen: this.rutaImagen + tarjeta.nombre + '.png',
    }));

    // this.imprimirTablaConsole();

    this.nombreSala = datos.sala;
    this.hora = datos.hora;

    for (var i = 0; i < this.listaTarjetas.length; i++) {
      this.ocultarBotones[i] = true;
      //this.listaTarjetas[i].imagen = null;
      //edgar this.rangoNumeros.push(i);
    }

    this.rangoNumeros = [];
    this.rangoNumeros = Array.from({ length: 20 }, (_, index) => index);
    for (var i = 0; i < 20; i++) {
      this.rangoNumeros.push(i);
    }

    this.hideButton = new Array(this.listaTarjetas.length).fill(false);
    this.hideImage = new Array(this.listaTarjetas.length).fill(true); // Inicializa hideImage correctamente
  }

  /* -------------------------------------------------
        NIVEL MAQUINA
----------------------------------------------------*/

  async nivelBasico() {
    var pareja = this.encontrarPareja();
    if (pareja) {
      // if(pareja.primeraPareja.index ===  pareja.segundaPareja.index)  {
      //   this.nivelBasico();
      // }

      //console.log(`Pareja encontrada: Indices ${pareja.primeraPareja.index} y ${pareja.segundaPareja.index}, Nombre: ${pareja.primeraPareja.nombre}`);
      await this.secuenciaCartas(
        pareja.primeraPareja.index,
        pareja.primeraPareja.nombre
      );

      await this.secuenciaCartas(
        pareja.segundaPareja.index,
        pareja.primeraPareja.nombre
      );
    } else {
      //manda un randomize donde las parejas no esten hechas
      this.jugandoMaquina = true;
      this.nombreImagenDos = this.nombreImagen;

      if (this.rangoNumeros.length > 1) {
        let numerosSeleccionados;
        do {
          numerosSeleccionados = this.seleccionarDosNumerosDiferentes([
            ...this.rangoNumeros,
          ]);
        } while (!numerosSeleccionados);

        this.datosDoka =
          numerosSeleccionados[0] + ' ' + numerosSeleccionados[1];

        // if (numerosSeleccionados[0] === numerosSeleccionados[1]) {
        //   this.nivelBasico()
        // }

        await this.secuenciaCartas(
          numerosSeleccionados[0],
          this.listaTarjetas[numerosSeleccionados[0]].nombre
        );

        await this.secuenciaCartas(
          numerosSeleccionados[1],
          this.listaTarjetas[numerosSeleccionados[1]].nombre
        );
      }
    }
  }

  encontrarPareja() {
    const visto: { [key: string]: any } = {};
    for (let boton of this.botonesAbierto) {
      if (visto[boton.nombre]) {
        return {
          primeraPareja: visto[boton.nombre],
          segundaPareja: boton,
        };
      }
      visto[boton.nombre] = boton;
    }
    return null; // Si no hay ninguna pareja
  }

  seleccionarDosNumerosDiferentes(
    rangoNumeros: number[]
  ): [number, number] | null {
    // Selección aleatoria de dos números del rango
    const indice1 = Math.floor(Math.random() * rangoNumeros.length);
    let indice2 = Math.floor(Math.random() * rangoNumeros.length);

    // Si los dos índices son iguales, seleccionamos el segundo índice de nuevo hasta que sean diferentes
    while (indice2 === indice1) {
      indice2 = Math.floor(Math.random() * rangoNumeros.length);
    }
    // Devolvemos un arreglo con los dos números seleccionados
    return [rangoNumeros[indice1], rangoNumeros[indice2]];
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
    return new Promise((resolve) => {
      this.timeoutRef = setTimeout(() => {
        this.hizoClickBotones(false, index, nombre);
        resolve();
      }, 1000);
    });
  }

  //edgar
  // agregarBotones(boton: number, nombre: string) {
  //   // Verifica si el arreglo ya contiene un elemento con el mismo nombre y el mismo index
  //   const existe = this.botonesAbierto.some(b => b.index === boton && b.nombre.toLowerCase() === nombre.toLowerCase());
  //   if (!existe) {
  //     // Si no existe, agrega el nuevo objeto al arreglo
  //     this.botonesAbierto.push({
  //       index: boton,
  //       nombre: nombre
  //     });
  //     this.imprimirTablaConsole();
  //   }
  // }

  fadeButton(index: number) {
    this.hideButton[index] = true; //reproducir animacion
    this.hideImage[index] = !this.ocultarBotones[index]; // Mostrar la imagen correspondiente al botón clicado true
    setTimeout(() => {
      this.fadeImage(index);
    }, 500);
  }

  fadeImage(index: number): void {
    if (this.imageTimeouts[index]) {
      clearTimeout(this.imageTimeouts[index]);
    }
    this.hideImage[index] = false; // Mostrar la imagen correspondiente al botón clicado

    this.imageTimeouts[index] = setTimeout(() => {}, 800);
  }

  /* ----------------------------------------------------------------------------------
                          sonar el audio de las palabras
  ---------------------------------------------------------------------------------- */

  sonarAudio(splass: boolean, index: number) {
    if (splass) {
      this.nombreArchivoAsonar = '../../assets/sonidos/splash.wav';
    } else {
      this.nombreArchivoAsonar = `assets/icons-audios/nivel${this.nivel}/audios/${this.listaTarjetas[index].nombre}.wav`;
    }

    //alert(this.nombreArchivoAsonar)
    var sound = new Howl({
      src: this.nombreArchivoAsonar,
      volume: 0.5,
      onend: () => {},
    });
    sound.play();
  }

  /* ----------------------------------------------------------------------------------
                          validar si hizo pareja en
  ---------------------------------------------------------------------------------- */

  validarJuegoEnParejas(datos: any) {
    if (datos.clics == 1) {
      this.ocultarBotones[0] = false; //oculta el boton
      this.listaTarjetas[0].imagen =
        this.rutaImagen + datos.nombreImagenUno + ".png')";
      this.sonarAudio(false, datos.botonIndexUno);
      //   this.nombreImagen = datos.nombreImagenUno;

      this.ocultarBotones[datos.botonIndexUno] = true; //oculta el boton
      this.image[datos.botonIndexUno] =
        this.rutaImagen + datos.nombreImagenUno + '.png';
      this.listaTarjetas[datos.botonIndexUno].imagen =
        this.rutaImagen + datos.nombreImagenUno + ".png')";
      //  this.nombreImagen = datos.nombreImagenUno;
      this.fadeButton(datos.botonIndexUno);
    } else if (datos.clics == 2) {
      this.ocultarBotones[datos.botonIndexDos] = true; //oculta el boton
      this.image[datos.botonIndexDos] =
        this.rutaImagen + datos.nombreImagenDos + '.png';
      this.listaTarjetas[datos.botonIndexDos].imagen =
        this.rutaImagen + datos.nombreImagenDos + ".png')";
      this.nombreImagen = datos.nombreImagenDos;
      this.fadeButton(datos.botonIndexDos);
      this.listaTarjetas[datos.botonIndexDos].imagen =
        this.rutaImagen + datos.nombreImagenDos + ".png')";
      this.sonarAudio(false, datos.botonIndexDos);
      this.nombreImagen = datos.nombreImagenDos;
    }

    // Hacer una pausa de 2 segundos
    //console.log("Esperando 2 segundos...");
    setTimeout(() => {
      // Aquí colocas la lógica que deseas ejecutar después de la pausa
      //console.log("Pasaron 2 segundos. Continuando con la lógica...");
      if (datos.clics == 2) {
        this.listaTarjetas[datos.botonIndexUno].imagen = '';
        this.listaTarjetas[datos.botonIndexDos].imagen = '';

        //console.log('\x1b[33m%s\x1b[0m', " ---------------- hizoPareja ", datos.hizoPareja);
        this.puntosA = datos.puntosA;
        this.puntosB = datos.puntosB;

        if (datos.hizoPareja == false) {
          //no hizo parjea
          //edgar
          // this.agregarBotones(datos.botonIndexUno, datos.nombreImagenUno);
          // this.agregarBotones(datos.botonIndexDos, datos.nombreImagenDos);

          this.ocultarBotones[datos.botonIndexUno] = true; //mostar el boton
          this.ocultarBotones[datos.botonIndexDos] = true; //mostar  el boton
          this.hideButton[datos.botonIndexUno] = false;
          this.hideButton[datos.botonIndexDos] = false;
          this.hideImage[datos.botonIndexUno] = true;
          this.hideImage[datos.botonIndexDos] = true;
        } else {
          //hizo pareja
          //edgar
          // //Eliminar la pareja encontrada
          // this.botonesAbierto = this.botonesAbierto.filter(boton => boton.index !== datos.botonIndexUno && boton.index !== datos.botonIndexDos);

          this.imagenHizoPareja();

          this.parejasHechas[this.Ipos] = datos.botonIndexUno;
          this.Ipos++;
          this.parejasHechas[this.Ipos] = datos.botonIndexDos;
          this.Ipos++;
          this.sonidosdelJuego('HizoPareja.wav');
          this.hideButton[datos.botonIndexUno] = true;
          this.hideButton[datos.botonIndexDos] = true;
          this.hideImage[datos.botonIndexUno] = true;
          this.hideImage[datos.botonIndexDos] = true;

          this.eliminarParejaPorValor(datos.botonIndexUno, datos.botonIndexDos);
        }

        //  this.juegoTerminado = datos.juegoTerminado;
        if (datos.juegoTerminado == true) {
          this.finalizarJuego(
            datos.nombreJugadorA,
            datos.puntosA,
            datos.nombreJugadorB,
            datos.puntosB,
            datos.ico1,
            datos.ico2,
            datos.socket1,
            datos.socket2,
            datos.sala,
            this.imgAvatarJugador1,
            this.imgAvatarJugador2,
            datos.resultadofinal1,
            datos.resultadofinal2,
            'jugadorIa'
          );

          localStorage.setItem('quienJuega', 'jugadorIa');
          localStorage.setItem('sala', datos.sala);
        } else {
          if (datos.turno !== true) {
            //this.ensayo(1);
            this.toggleText(this.ocultarMsgManos, 'Espera', false);
            if (datos.juegoTerminado == false) {
              // if (this.swUnaSolaVezEspera === true) {
              //  this.swUnaSolaVezEspera = false;
              //}
              this.paraSeguirCronometro(true);
              this.nivelBasico();
            }
          } else {
            //this.ensayo(2);
            this.toggleText(this.ocultarMsgManos, 'Juegas tú', true);
            this.clicUsuario = 0;
            // if(  this.swUnaSolaVezEspera === true )  {
            //   this.toggleText(true, "Juegas tú", true);
            // }
            this.paraSeguirCronometro(false);
          }
        }
      }
    }, 1000);
  }

  seleccionarDosNumeros = function (arr: any) {
    if (arr.length < 2) {
      return null; // No hay suficientes elementos para seleccionar dos
    }
    let idx1 = Math.floor(Math.random() * arr.length);
    let idx2 = Math.floor(Math.random() * arr.length);
    while (idx1 === idx2) {
      // Asegura que no se seleccione el mismo índice dos veces
      idx2 = Math.floor(Math.random() * arr.length);
    }
    return [arr[idx1], arr[idx2]];
  };

  eliminarParejaPorValor(valor1: number, valor2: number) {
    //  thrangoNumeros = this.rangoNumeros.filter(num => num !== valor1 && num !== valor2);
    for (let i = 0; i < this.rangoNumeros.length; i++) {
      if (this.rangoNumeros[i] === valor1 || this.rangoNumeros[i] === valor2) {
        this.rangoNumeros.splice(i, 1);
        i--; // Decrementa el índice para compensar el cambio en la longitud del array
      }
    }
    this.imprimirTablaConsole();
  }

  /*-------------------------------------------------------------------------------------------- 
                             CUANDO ENTRA LA PANTALLA
    ------------------------------------------------------------------------------------------*/

  ionViewWillEnter() {}

  /*-------------------------------------------------------------------------
                          CRONOMETRO
   --------------------------------------------------------------------------*/
  paraSeguirCronometro(opc: boolean) {
    if (opc === true) {
      this.stopTimerA();
      this.startTimerB();
    } else {
      this.stopTimerB();
      this.resumeTimerA();
    }
  }

  startTimerA(): void {
    this.timerSubscription = this.servicioDeTemporizador
      .obtenerCuentaAtrasTimer1()
      .subscribe((tiempo) => {
        this.displayTimeA = this.formatTime(tiempo); // Usar la función de formato aquí
      });
    this.servicioDeTemporizador.iniciarCuentaAtrasTimer1();
  }

  stopTimerA(): void {
    this.servicioDeTemporizador.detenerTimer1();
  }

  resumeTimerA(): void {
    this.servicioDeTemporizador.reanudarCuentaAtrasTimer1();
  }

  /*--------------------------------------------------------
                  segundo timer 
  ----------------------------------------------------------*/
  startTimerB(): void {
    this.timerSubscription = this.servicioDeTemporizador
      .obtenerCuentaAtrasTimer2()
      .subscribe((tiempo) => {
        this.displayTimeB = this.formatTime(tiempo); // Usar la función de formato aquí
      });
    this.servicioDeTemporizador.iniciarCuentaAtrasTimer2();
  }

  stopTimerB(): void {
    this.servicioDeTemporizador.detenerTimer2();
  }

  resumeTimerB(): void {
    this.servicioDeTemporizador.reanudarCuentaAtrasTimer2();
  }

  imprimirTablaConsole() {
    console.clear();
    console.log(
      'x1b[32m LISTA DE TARJETAS',
      'color: fuchsia; font-weight: bold;'
    );
    console.table(this.listaTarjetas); // Para una vista tabular
    console.log('\x1b[36m  BOTONES ABIERTOS FRON END');
    console.table(this.botonesAbierto); // Para una vista tabular

    // console.log('\x1b[33m%s\x1b[0m', " ----------BOTONES ABIERTOD DEL BACKEN   ");
    // console.table(this.botonesAbiertoBackend);
  }

  sonidosdelJuego(nombreAudio: string) {
    var soundid = new Howl({
      //src: ['assets/icons-audios/nivel' + this.nivel + '/audios/' + this.listaTarjetas[index].nombre + '.wav'],
      src: ['assets/sonidos/' + nombreAudio],
      // src: ['assets/icons-audios/nivel1/audios/HizoPareja.wav'],
      volume: 1.9,
      onend: () => {},
    });

    soundid.play();
  }

  /*
      ----------------------------------------------------------------------------------------
                                    JUEGO FINALIZADO
      -----------------------------------------------------------------------------------------
    */

  finalizarJuego(
    jugador1: string,
    puntosA: number,
    jugador2: string,
    puntosB: number,
    ICo1: number,
    ICo2: number,
    socket1: string,
    socket2: string,
    sala: string,
    urlAvatar1: string,
    urlAvatar2: string,
    resultadofinal: string,
    resultadofina2: string,
    pagina: string
  ) {
    const resultado = {
      jugador1: {
        nombre: jugador1,
        puntos: puntosA,
        iCo: ICo1,
        socket: socket1,
        sala: sala,
        urlAvatar: urlAvatar1,
        resultadofinal: resultadofinal,
      },
      jugador2: {
        nombre: jugador2,
        puntos: puntosB,
        iCo: ICo2,
        socket: socket2,
        sala: sala,
        urlAvatar: urlAvatar2,
        resultadofinal: resultadofina2,
      },

      pagina: pagina,
    };

    // Guardar el resultado del juego
    this.guardarResultadosService.guardarResultados(resultado);

    // Navegar a la página de juego finalizado
    //  this.router.navigate(['/terminojuego']);

    this.navCtrl.navigateRoot('/juego-terminado');
  }

  imagenHizoPareja() {
    // Ocultar la imagen después de 2 segundos
    this.showImage = true;
    setTimeout(() => {
      this.showImage = false;
    }, 1200);
  }
}
