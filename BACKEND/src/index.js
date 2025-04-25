/* Monarca99 Simión43 Mono-lítico22 Monótono45 Monoriel35 SimioVeloz88 Tití23 Macaco88 QueMono55 Monógamo86 TitíTech21 SpaceMonkey Primate22
*/
import fs from 'fs';
import express from 'express';
import { getConnection, sql, queries } from "./database/index.js"
import { createRequire } from 'module';
import cors from 'cors';
import path, { normalize } from 'path';
import { fileURLToPath } from 'url'; 
 
//import { createRequire } from 'module';
import { connected } from 'process';
 
const app = express();
 
 

import edgar from './edgar.js';
import colors from 'colors';
import { strict } from 'assert';
import { Console, count } from "console";
 
const require = createRequire(import.meta.url);
import https from 'https';
import { get } from 'http';
// Objeto para almacenar las salas y los jugadores en cada sala
const salas = {};
const moment = require('moment');

const { v4: uuidv4 } = require('uuid');


/* -------------------------------------------------------------------------------------------
                                  definicion variables
-------------------------------------------------------------------------------------------*/
//const botonesAbiertos = Array.from({ length: 19 }, (_, index) => ({ index, nombre: '' }));


app.use(express.json());
app.set('trust proxy', true);

// Configurar CORS para permitir peticiones desde Angular (localhost y producción)
app.use(cors({
    origin: ['http://localhost:8100', 'http://localhost:4200', 'https://coningplay.com'], // Permitir solicitudes desde Angular en local y producción
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '\\ssl', 'coningplay.com-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '\\ssl', 'coningplay.com-crt.pem')),
  ca: fs.readFileSync(path.join(__dirname, '\\ssl', 'coningplay.com-chain.pem'))
};

let jugadoresAvatar = [];
let hideButton = [];
let palabras = [];
const botonesAbiertos = [];
var veces = 0;
var socketEnviar = '';
var resultadosBusqueda = '';
var usuario = '';
var rutaAvatar = '';
var totalAvatar = 4;
var mensaje = '';
var nombreJugador = '';
let juegos = {};
var listadojugadores = [];
var salaParejas = '';
var nombreSala = '';
var totalNiveles = 4;
var totalPalabras = 10; 
var nivelAleatorio = 1;
var listaTarjetas;
var bHizoPareja = false;

var datosRecibidos = [];
var sOption = '';
var nombreAux = '';
var sonidoAux = 0;
var significadoAux = '';
var imagenAux = '';
var numeroRandon = 0;
//let rutaAvatar = '';

/* -------------------------------------------------------------------------------------------
                             vector del litado de las imagenes
-------------------------------------------------------------------------------------------*/

const http = https.createServer(httpsOptions, app); // Crear servidor HTTPS

const io = require('socket.io')(http, {
  cors: {
    origin: true,
    Credential: true,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
  },
});
  
// Crear y arrancar el servidor HTTPS en el puerto 3000

http.listen(3002, () => {
  console.log('listening on port :3002');
});

/*
   ----------------------------------------------------------------------------------
                                CONEXION CON EL FRONT END
  ---------------------------------------------------------------------------------- 
*/
io.on('connection', (socket) => {
  console.log('SE CONECTO', socket.id, moment().format('hh:mm:ss'));


  // Limpiar listeners antiguos si existen
  socket.removeAllListeners('ingreso');
  socket.removeAllListeners('invitar-A-jugar');
  socket.removeAllListeners('solicitar-juego');
  socket.removeAllListeners('click');
  socket.removeAllListeners('espectador');
  socket.removeAllListeners('informacionSalas');
  socket.removeAllListeners('salio-De-Juego');
  socket.removeAllListeners('jugadores-online');
  socket.removeAllListeners('salir-de-online');
  socket.removeAllListeners('invitar-A-Jugar-online');
  socket.removeAllListeners('rta-invitar-A-Jugar-online');
  socket.removeAllListeners('abrir-juego');
  socket.removeAllListeners('leave');
  socket.removeAllListeners('quitar-Jugador');
  socket.removeAllListeners('recibir-jugadores-online');
  socket.removeAllListeners('enviar-jugadores');
  socket.removeAllListeners('jugador-se-desconecto');
  socket.removeAllListeners('no-acepto');

  console.log(" los juego ////////////////////////////////////////////// --------", juegos);

  socket.on('enviar-jugadores', () => {
    io.emit('enviar-jugadores', {
      jugadoresAvatar: jugadoresAvatar,

    });
    console.log("doka  ")
    console.table(jugadoresAvatar)

  });


  io.emit('informacionSalas', {
    juegos: juegos,
  });

  /*----------------------------------------------------------------------------
                                   NO ACEPTO
  ----------------------------------------------------------------------------*/
  socket.on('no-acepto', (data) => {
    console.log("no-acepto  ", data.nombre1, data.nombre2, data.socket2)
    io.to(data.socket2).emit('no-acepto', {});
    // Actualizar la propiedad 'visualizar' de 'eli' y 'sebas' a true
    jugadoresAvatar.forEach(jugador => {
      if (jugador.nombre === data.nombre1 || jugador.nombre === data.nombre2) {
        jugador.visualizar = true;
      }
    });

    console.log("no-acepto  ")
    console.table(jugadoresAvatar)
    enviarJugadoresEnLine(io, jugadoresAvatar);

  });


  // Manejador de evento para cuando un socket abandona una sala
  socket.on('leave', (opc, room, nombre) => {
    console.log(`Socket ${socket.id} abandonó la sala ${room}`);

    if (opc == 0) {
      // visualizar online
      visulazarJugador(socket.id, false);
      socket.leave(room);
    } else {
      visulazarJugador(socket.id, false);
    }
    enviarJugadoresEnLine(io, jugadoresAvatar);
  });


  /* ----------------------------------------------------------------------------------------
                                EVENTO INGRESO 
   ----------------------------------------------------------------------------------------*/
  socket.on('ingreso', (data) => {
    console.log("** Datos recibidos:", data, moment().format('hh:mm:ss'));

    // Deberías asegurarte de que 'data' incluya la propiedad 'jugador'.
    // Si 'data' no tiene la propiedad 'jugador', esto podría causar errores.
    if (!data.jugador) {
      console.error('El dato "jugador" no está presente en el mensaje recibido.');
      return;  // Termina la ejecución si no hay jugador.
    }
    const nombreJugador = data.jugador + ' (' + socket.id + ')';
    rutaAvatar = '../../assets/avatar/' + data.jugador + '.gif'; //ahora se borra

    console.log(nombreJugador, " ingreso al sistema ");
    // Envía una respuesta específica de vuelta al mismo cliente que envió el mensaje.
    io.to(socket.id).emit('ingreso', {
      usuario: data.jugador,
      rutaAvatar: rutaAvatar,
      socket: socket.id,
      hora: moment().format('hh:mm:ss'),
    });

    // io.emit('informacionSalas', {
    //   juegos: juegos,
    // });


  });


  /* ----------------------------------------------------------------------------------------
                                INVITAR A JUGADOR 
   ---------------------------------  -------------------------------------------------------*/
  socket.on('invitar-A-jugar', (data) => {

    let salaJugador = data.sala || uuidv4();  // Usar la sala existente o crear una nueva

    if (!juegos[salaJugador]) {
      juegos[salaJugador] = { jugadores: [] };  // Crear estructura de sala si no existe
    }
    // Crear y añadir jugador1 si no existe
    const jugador1Data = crearJugador(data.idTabla, data.jugador, 1, socket.id, data.urlAvatarJugador1, salaJugador, true, 0, 'jugador', data.ico);
    anadirJugadorSiNoExiste(salaJugador, jugador1Data);

    socket.join(salaJugador);  // Unir al jugador que invita a la sala

    console.log("sala craadoa ", juegos[salaJugador], "nombre sala ", salaJugador)

    // Emitir evento de respuesta
    io.to(socket.id).emit('invitar-A-jugar', {
      sala: salaJugador,
      // otros datos según sea necesario
    });

    console.log(" ----------  invitar  a jugar  ", data)

  });
  /* ----------------------------------------------------------------------------------------
                                  ENVIAR EL JUEGO
   ---------------------------------  -------------------------------------------------------*/
  socket.on('solicitar-juego', (data) => {
    console.log("/*/*/*/*/ llego A SOLICITAR JUEGO", data)
    const salaRecibida = data.sala;
    if (!juegos[salaRecibida]) {
      juegos[salaRecibida] = { jugadores: [] };  // Asegurar que la sala exista
    }


    // Generar un número aleatorio entre 1 y totalNiveles  (o cualquier rango que desees)
    nivelAleatorio = Math.floor(Math.random() * totalNiveles) + 1;
    //nivelAleatorio = 5  // 5 Y F FALTAN
    randomizarTarjetas(nivelAleatorio);
    // Crear y añadir jugador2 si no existe
    const jugador2Data = crearJugador(data.idTabla, data.jugador2, nivelAleatorio, "3104082373", data.urlAvatarJugador2, salaRecibida, false, 0, 'jugador', data.ico);
    anadirJugadorSiNoExiste(salaRecibida, jugador2Data);
    socket.join(salaRecibida);  // Unir al jugador invitado a la sala
    console.log("sala craadoa ", juegos[salaRecibida], "nombre sala ", salaRecibida)


    //copiar las palarbas de jugador 2 a jugador 1    
    juegos[salaRecibida].jugadores[0].palabras = [];
    juegos[salaRecibida].jugadores[0].hideButton = [];

    agregarTodasLasPalabras();
    //



    juegos[salaRecibida].jugadores[0].palabras = juegos[salaRecibida].jugadores[1].palabras.slice();
    juegos[salaRecibida].jugadores[0].hideButton = juegos[salaRecibida].jugadores[1].hideButton.slice();

    juegos[salaRecibida].jugadores[0].nivel = nivelAleatorio;
    juegos[salaRecibida].jugadores[1].nivel = nivelAleatorio;


    io.to(juegos[salaRecibida].jugadores[0].socket).emit('solicitar-juego', {
      nombre: juegos[salaRecibida].jugadores[0].nombre,
      nombreJugador1: juegos[salaRecibida].jugadores[0].usuario,
      nombreJugador2: juegos[salaRecibida].jugadores[1].usuario,
      nivel: nivelAleatorio,
      tarjetas: listaTarjetas,
      sala: salaRecibida,
      hora: moment().format('hh:mm:ss'),
      turno: juegos[salaRecibida].jugadores[0].turno,
      Ico1: juegos[salaRecibida].jugadores[0].Ico,
      Ico2: juegos[salaRecibida].jugadores[1].Ico,
      urlAvatar1: juegos[salaRecibida].jugadores[0].urlAvatar,
      urlAvatar2: juegos[salaRecibida].jugadores[1].urlAvatar,
      socket1: juegos[salaRecibida].jugadores[0].socket,
      socket2: juegos[salaRecibida].jugadores[1].socket,
    });

    // io.emit('informacionSalas', {
    //   juegos: juegos,
    // });





  });

  socket.on('click', (data) => {
    /* --------------------------------------------------------------------------------------
                         hizo click paraejas
    ----------------------------------------------------------------------------------------*/
    const salaclick = data.sala;
    analizarJugadasParejas(salaclick, data.botonIndex, data.nombreImagen, data.tiempoA, data.tiempoB);
    console.log('\x1b[33m%s\x1b[0m', " -----botoens borrados - ", ' hora ', moment().format('hh:mm:ss'));
    console.log(juegos[salaclick])

    juegos[salaclick].jugadores.forEach((jugador) => {
      io.to(jugador.socket).emit('click', {
        botonIndexUno: jugador.indexUnoAux,
        botonIndexDos: jugador.indexDosAux,
        nombreImagenUno: jugador.nombreImagenUno,
        nombreImagenDos: jugador.nombreImagenDos,
        hora: moment().format('hh:mm:ss'),
        hizoPareja: jugador.hizoPareja,
        clics: jugador.clic,
        puntosA: juegos[salaclick].jugadores[0].puntaje,
        puntosB: juegos[salaclick].jugadores[1].puntaje,
        juegoTerminado: jugador.juegoTerminado,
        turno: jugador.turno,
        resultadofinal1: juegos[salaclick].jugadores[0].resultadofinal,
        resultadofinal2: juegos[salaclick].jugadores[1].resultadofinal,
        sala: salaclick,
        botonesAbiertos: juegos[salaclick].jugadores[0].botonesAbiertos,
        hideButton: juegos[salaclick].jugadores[0].hideButton,
        nombreJugadorA: juegos[salaclick].jugadores[0].usuario,
        nombreJugadorB: juegos[salaclick].jugadores[1].usuario,
        ico1: juegos[salaclick].jugadores[0].Ico,
        ico2: juegos[salaclick].jugadores[1].Ico,
      });
    });

  });


  /* ----------------------------------------------------------------------------------------
                               ESPECTADOR 
  -------------------------------------------------------------------------------------------*/
  socket.on('espectador', (data) => {
    // Crear y añadir jugador2 si no existe
    const salaEspe = data.sala;
    const nivAle = juegos[salaEspe].jugadores[0].nivel;
    const espectador = data.nombreEspectador;

    console.log(" espectador //////// ", salaEspe)

    const jugadorInvitadoData = crearJugador(-1, espectador, nivAle, socket.id, '', salaEspe, false, juegos[salaEspe].jugadores[0].clic, 'espectador', 0);
    anadirJugadorSiNoExiste(salaEspe, jugadorInvitadoData);

    socket.join(salaEspe);  // Unir al jugador invitado a la sala

    juegos[salaEspe].jugadores[2].clic = juegos[salaEspe].jugadores[0].clic

    console.log("nombre espectador ", espectador, "sala participante ", juegos[salaEspe], "participante sala ", salaEspe, ' nivel ', nivAle)

    console.clear()

    console.log(" paejas ocultas ", juegos[salaEspe].jugadores[0].hideButton);

    console.log(" paejas ocultas ", juegos[salaEspe].jugadores[1].hideButton);


    io.to(socket.id).emit('espectador', {
      tarjetas: juegos[salaEspe].jugadores[0].palabras,
      urlAvatar1: juegos[salaEspe].jugadores[0].urlAvatar,
      urlAvatar2: juegos[salaEspe].jugadores[1].urlAvatar,
      nombreJugador1: juegos[salaEspe].jugadores[0].usuario,
      nombreJugador2: juegos[salaEspe].jugadores[1].usuario,
      nivel: juegos[salaEspe].jugadores[1].nivel,
      Ico1: juegos[salaEspe].jugadores[0].Ico,
      Ico2: juegos[salaEspe].jugadores[1].Ico,
      puntosA: juegos[salaEspe].jugadores[0].puntaje,
      puntosB: juegos[salaEspe].jugadores[1].puntaje,
      turno: juegos[salaEspe].jugadores[0].turno,
      hideButton: juegos[salaEspe].jugadores[1].hideButton,


    });

  });

  /* ----------------------------------------------------------------------------------------
                               RECIBIR SOLICITUD DE LAS SALAS 
   ----------------------------------------------------------------------------------------*/
  socket.on('informacionSalas', (data) => {
    console.log("** Datos recibidos:", data, moment().format('hh:mm:ss'));
    io.emit('informacionSalas', {
      juegos: juegos,
    });

  });

  /* ----------------------------------------------------------------------------------------
                              
 ----------------------------------------------------------------------------------------*/
  socket.on('jugadores-online', (data) => {
    console.log("** jugadores-online :", data, moment().format('hh:mm:ss'));

    agregarQuitarJugadorOnline(1, socket.id, data.nombre, data.rutaAvatar, data.ico)

    console.log("//////////////////// doka crear jugadores ")

    jugadoresAvatar = jugadoresAvatar.filter(jugador =>
      jugador.visualizar === true
    );


    enviarJugadoresEnLine(io, jugadoresAvatar);

  });

  // Manejador de evento para cuando un socket abandona una sala
  socket.on('quitar-Jugador', (nombre) => {
    agregarQuitarJugadorOnline(0, socket.id, nombre, '', '')

    console.log(nombre, " quitar jugador")
    console.table(jugadoresAvatar);

    jugadoresAvatar = jugadoresAvatar.filter(jugador =>
      jugador.visualizar === true
    );

    // Enviar la lista actualizada de jugadores en línea a todos los clientes
    enviarJugadoresEnLine(io, jugadoresAvatar);



  });

  /* ----------------------------------------------------------------------------------------
                              SALIR DE PAGE ONLINE  
  ----------------------------------------------------------------------------------------*/
  socket.on('salir-de-online', (data) => {
    console.log("** salir-de-online :", data, moment().format('hh:mm:ss'));

    //edgar removerJugadorDeSala(socket.id)


    // agregarQuitarJugadorOnline(0, data.socketid, data.nombre, data.rutaAvatar, data.ico)

    // io.emit('jugadores-online', {
    //   jugadoresAvatar: jugadoresAvatar,
    // });


  });


  /* ----------------------------------------------------------------------------------------
                              INVITAR A JUGAR ONLINE  
  ----------------------------------------------------------------------------------------*/
  socket.on('invitar-A-Jugar-online', (data) => {
    console.log("** invitar-A-Jugar-online :", socket.id, data, moment().format('hh:mm:ss'));

    visulazarJugador(data.socket2, false);

    console.log("egar oso")

    console.table(data)


    let salaJugador = crearPrimerJugador(data, socket.id);
    io.to(data.socket2).emit('rta-invitar-A-Jugar-online', {
      rta: data.jugador1 + ' te invita a jugar coning, acepta?',
      info: data,
      socket1: socket.id,
      sala: salaJugador
    });

    visulazarJugador(socket.id, false);

    io.to(socket.id).emit('invitar-A-Jugar-online', {
      rta: ' esperando aceptación de ' + data.jugador2,
      info: data,
    });

    // no se 
    // jugadoresAvatar = jugadoresAvatar.filter(jugador =>
    //   jugador.visualizar === true
    // );


    console.log("envio vixualizar")
    console.table(jugadoresAvatar)

    enviarJugadoresEnLine(io, jugadoresAvatar);

  });

  /* ----------------------------------------------------------------------------------
                               JUGADOR SALIO DE LA SALA
    ---------------------------------------------------------------------------------- */
  socket.on('salio-De-Juego', function () {
    removerJugadorDeSala(socket.id)
    console.log(' salio de la sala el jugador   ', socket.id);
    removerJugadorDeSala(socket.id)


  });

  /* ----------------------------------------------------------------------------------
                               JUGADOR SALIO DE LA SALA
    ---------------------------------------------------------------------------------- */
  socket.on('abrir-juego', (data) => {
    console.log(' abrir el juego a los dos jugadores    ', data, socket.id);
    let salaRecibida = crearSegundoJugador(data, socket.id);
    // //console.log("nombre de la sala ", salaJugador);

    console.table(jugadoresAvatar);

    io.to(salaRecibida).emit('abrir-juego', {});

    //copiar las palarbas de jugador 2 a jugador 1    
    juegos[salaRecibida].jugadores[0].palabras = [];
    juegos[salaRecibida].jugadores[0].hideButton = [];

    juegos[salaRecibida].jugadores[0].palabras = juegos[salaRecibida].jugadores[1].palabras.slice();
    juegos[salaRecibida].jugadores[0].hideButton = juegos[salaRecibida].jugadores[1].hideButton.slice();
    juegos[salaRecibida].jugadores[1].nivel = juegos[salaRecibida].jugadores[0].nivel
    // Enviar el evento 'solicitar-juego' a todos los jugadores en la sala
    juegos[salaRecibida].jugadores.forEach((jugador) => {
      io.to(jugador.socket).emit('solicitar-juego', {
        nombre: jugador.nombre,
        nombreJugador1: juegos[salaRecibida].jugadores[0].usuario,
        nombreJugador2: juegos[salaRecibida].jugadores[1].usuario,
        nivel: jugador.nivel,
        tarjetas: listaTarjetas,
        sala: salaRecibida,
        hora: moment().format('hh:mm:ss'),
        turno: jugador.turno,
        Ico1: juegos[salaRecibida].jugadores[0].Ico,
        Ico2: juegos[salaRecibida].jugadores[1].Ico,
        urlAvatar1: juegos[salaRecibida].jugadores[0].urlAvatar,
        urlAvatar2: juegos[salaRecibida].jugadores[1].urlAvatar,
        socket1: juegos[salaRecibida].jugadores[0].socket,
        socket2: juegos[salaRecibida].jugadores[1].socket,
      });
    });

  });



  /* ----------------------------------------------------------------------------------
                                 se desconecto el cliente
    ---------------------------------------------------------------------------------- */
  socket.on('disconnect', function () {
    console.log(' SE DESCONECTO  ', socket.id);
    removerJugadorDeSala(socket.id);

    // Filtrar los jugadores que no tienen el mismo socket ID
    jugadoresAvatar = jugadoresAvatar.filter(jugador =>
      jugador.socketid !== socket.id
    );


    io.emit("jugador-se-desconecto", {
      detalle: 'el usuario se ha de desconetado'
    });


    enviarJugadoresEnLine(io, jugadoresAvatar);

    console.log("envio desconecao a los sala")
    console.table(jugadoresAvatar)

  });



  // io.emit('informacionSalas', {
  //   juegos: juegos,
  // });




  /* ----------------------------------------------------------------------------------
                               FUNCTION PARA AGREGAR PRIMER JUGADOR 
  ---------------------------------------------------------------------------------- */
  function crearPrimerJugador(data, socketId) {
    let salaJugador = uuidv4();  // Usar la sala existente o crear una nueva
    // Generar un número aleatorio entre 1 y totalNiveles  (o cualquier rango que desees)
    nivelAleatorio = Math.floor(Math.random() * totalNiveles) + 1;
    //nivelAleatorio = 2
    randomizarTarjetas(nivelAleatorio);

    if (!juegos[salaJugador]) {
      juegos[salaJugador] = { jugadores: [] };  // Crear estructura de sala si no existe
    }

    // Crear y añadir jugador1 si no existe
    const jugador1Data = crearJugador(data.idTabla, data.jugador1, nivelAleatorio, socketId, data.rutaAvatar1, salaJugador, true, 0, 'jugador', data.ico);
    anadirJugadorSiNoExiste(salaJugador, jugador1Data);

    socket.join(salaJugador);  // Unir al jugador que invita a la sala

    return salaJugador;
  }


  /* ----------------------------------------------------------------------------------
                               FUNCTION PARA AGREGAR SEGUNDO JUGADOR 
  ---------------------------------------------------------------------------------- */
  function crearSegundoJugador(data, socketId) {
    let salaRecibidoa = data.sala;
    /*--------------------------------------------------------------------------------------
                              CREAR EL SEGUNDO JUGADOR 
   ---------------------------------------------------------------------------------------*/
    // Crear y añadir jugador2 si no existe
    const jugador2Data = crearJugador(data.idTabla, data.datos.jugador2, 1, socketId, data.datos.rutaAvatar2, salaRecibidoa, false, 0, 'jugador', data.ico);
    anadirJugadorSiNoExiste(salaRecibidoa, jugador2Data);

    socket.join(salaRecibidoa);  // Unir al jugador invitado a la sala

    console.log("sala craadoa SEGUDNO  JUGAR ", juegos[salaRecibidoa], "nombre sala ", salaRecibidoa)

    return salaRecibidoa;

  }











}); //FIN SOCKET





/* ----------------------------------------------------------------------------------
                      CADA QUE HACE CLICK ANALIZAR LAS JUGADAS
 ---------------------------------------------------------------------------------- */
function analizarJugadasParejas(sala, botonNumero, nombreImagen, tiempoA, tiempoB) {
  juegos[sala].jugadores.forEach(jugador => {
    jugador.agregarBoton(botonNumero, nombreImagen);
    jugador.hizoPareja = false;
    jugador.clic++;
  });

  if (juegos[sala].jugadores[0].clic == 1) {
    juegos[sala].jugadores.forEach(jugador => {
      jugador.indexUnoAux = botonNumero
      jugador.nombreImagenUno = nombreImagen
    });
  }
  if (juegos[sala].jugadores[0].clic == 2) {

    juegos[sala].jugadores.forEach(jugador => {
      jugador.indexDosAux = botonNumero
      jugador.nombreImagenDos = nombreImagen
    });

    if (juegos[sala].jugadores[0].turno == true) {
      juegos[sala].jugadores[0].tiempo = tiempoA;

      if (juegos[sala].jugadores[0].nombreImagenUno == juegos[sala].jugadores[0].nombreImagenDos) {
        // hizo pareja
        juegos[sala].jugadores.forEach(jugador => {
          jugador.eliminarBoton(nombreImagen);
          jugador.hizoPareja = true;
          jugador.borrados++;
        });
        juegos[sala].jugadores[0].puntaje++;
        juegos[sala].jugadores[0].turno = true;
        juegos[sala].jugadores[1].turno = false;

        juegoTerminado(sala, 0);


      } else { // cambiar el truno 
        /* ------------------------------------------------------
                            No hizo pareja
         ------------------------------------------------------*/
        //        juegos[sala].jugadores[0].turno = false;

        juegos[sala].jugadores.forEach(jugador => {
          jugador.turno = false;
        });

        juegos[sala].jugadores[1].turno = true;
      }

    } else {
      juegos[sala].jugadores[1].tiempo = tiempoB;
      if (juegos[sala].jugadores[1].nombreImagenUno == juegos[sala].jugadores[1].nombreImagenDos) {
        // hizo pareja
        juegos[sala].jugadores.forEach(jugador => {
          jugador.eliminarBoton(nombreImagen);
          jugador.hizoPareja = true;
          jugador.borrados++;
        });
        juegos[sala].jugadores[1].puntaje++;
        juegos[sala].jugadores[1].turno = true;
        juegos[sala].jugadores[0].turno = false;

        juegoTerminado(sala, 1);

      } else {
        /* ------------------------------------------------------
                            Nno hizo parea
         ------------------------------------------------------*/
        //juegos[sala].jugadores[0].turno = true;
        juegos[sala].jugadores.forEach(jugador => {
          jugador.turno = true;
        });
        juegos[sala].jugadores[1].turno = false;
      }
    }

  }

  if (juegos[sala].jugadores[0].clic == 3) {
    juegos[sala].jugadores.forEach(jugador => {
      jugador.clic = 1;
      jugador.indexUnoAux = botonNumero;
      jugador.indexDosAux = 0;
      jugador.nombreImagenUno = nombreImagen;
      jugador.nombreImagenDos = null;
    });
  }


}

/*---------------------------------------------------------------------------------------
                                        JUEGO TERMINADO
----------------------------------------------------------------------------------------*/
function juegoTerminado(sala, opc) {
  if (juegos[sala].jugadores[opc].borrados == totalPalabras) { // Se termina el juego
    juegos[sala].jugadores.forEach(jugador => {
      jugador.juegoTerminado = true;
    });

    if (juegos[sala].jugadores[0].puntaje > juegos[sala].jugadores[1].puntaje) {
      juegos[sala].jugadores[0].resultadofinal = "gano";
      juegos[sala].jugadores[1].resultadofinal = "perdio";
      if (juegos[sala].jugadores[1].usuario === 'maquina') {
        juegos[sala].jugadores[0].Ico += 5;
        console.log("gano edgar ", juegos[sala].jugadores[0].Ico)
      } else {
        console.log("perdioo edgar ", juegos[sala].jugadores[0].Ico)
        juegos[sala].jugadores[0].Ico += 10;
        juegos[sala].jugadores[1].Ico += -10;
      }

      //   juegos[sala].jugadores[1].Ico = juegos[sala].jugadores[1].Ico < 80 ? 70 : juegos[sala].jugadores[1].Ico - 10;

    } else if (juegos[sala].jugadores[0].puntaje == juegos[sala].jugadores[1].puntaje) {
      juegos[sala].jugadores[0].resultadofinal = "empato";
      juegos[sala].jugadores[1].resultadofinal = "empato";
      if (juegos[sala].jugadores[1].usuario === 'maquina') {
        juegos[sala].jugadores[0].Ico += 1;
        console.log("empato edgar ", juegos[sala].jugadores[0].Ico)
      } else {
        juegos[sala].jugadores[0].Ico += 3;
        juegos[sala].jugadores[1].Ico += 3;
      }

    } else {

      juegos[sala].jugadores[0].resultadofinal = "perdio";
      juegos[sala].jugadores[1].resultadofinal = "gano";

      if (juegos[sala].jugadores[1].usuario === 'maquina') {
        juegos[sala].jugadores[0].Ico += -5;
        console.log("perdio edgar ", juegos[sala].jugadores[0].Ico)
      } else {
        juegos[sala].jugadores[0].Ico += -10;
        juegos[sala].jugadores[1].Ico += 10;
 
      }

    }
  }



  //  juegos[sala].jugadores[0].Ico = juegos[sala].jugadores[0].Ico < 80 ? 70 : juegos[sala].jugadores[0].Ico - 10;
  //  juegos[sala].jugadores[1].Ico = juegos[sala].jugadores[1].Ico < 80 ? 70 : juegos[sala].jugadores[1].Ico - 10;



  console.log("ico 1 ", juegos[sala].jugadores[0].Ico, ' ico 2 ', juegos[sala].jugadores[1].Ico)
  actualizarIco(juegos[sala].jugadores[0].idTabla, juegos[sala].jugadores[0].Ico, juegos[sala].jugadores[0].resultadofinal);
  actualizarIco(juegos[sala].jugadores[1].idTabla, juegos[sala].jugadores[1].Ico, juegos[sala].jugadores[1].resultadofinal);
}







function enviarJugadoresEnLine(io, jugadoresAvatar) {
  // Filtrar los jugadores que aún están en línea (cuya propiedad 'visualizar' es true)
  jugadoresAvatar = jugadoresAvatar.filter(jugador =>
    jugador.visualizar === true
  );

  io.emit('recibir-jugadores-online', {
    jugadoresAvatar: jugadoresAvatar,
  });
}


/* ----------------------------------------------------------------------------------
                             ACEPTAR O QUITAR JUGADORES 
---------------------------------------------------------------------------------- */
function agregarQuitarJugadorOnline(opcion, socketid, nombre, rutaAvatar, ico) {
  let nombreJugadorEliminar = nombre;
  if (opcion == 0) { //borrar el elemento por el nombre
    jugadoresAvatar = jugadoresAvatar.filter(jugador => jugador.nombre !== nombreJugadorEliminar);
    console.log("** lo quitar :", moment().format('hh:mm:ss'));
    //   console.table(jugadoresAvatar);
  } else {
    console.log("** lo grabo :", moment().format('hh:mm:ss'));
    jugadoresAvatar = jugadoresAvatar.filter(jugador => jugador.nombre !== nombreJugadorEliminar);
    // Puedes agregar más jugadores al array si es necesario
    jugadoresAvatar.push({
      nombre: nombre,
      ico: ico,
      rutaAvatar: rutaAvatar,
      socketid: socketid,
      visualizar: true,
    });

    console.log("** agregar :", moment().format('hh:mm:ss'));
    console.table(jugadoresAvatar);
  }



}

function removerJugadorDeSala(socketId) {


  Object.keys(juegos).forEach(sala => {
    let index = juegos[sala].jugadores.findIndex(j => j.socket === socketId);
    if (index !== -1) {
      //  console.log("rol del jugador salio del juego ", juegos[sala].jugadores[index].role, "  nombre jugaodr salio de sala ", juegos[sala].jugadores[index].usuario);
      juegos[sala].jugadores.splice(index, 1);
      //  console.log(`Jugador removido de la sala ${sala}`);

      // Considerar eliminar sala si está vacía
      if (juegos[sala].jugadores.length === 0) {
        delete juegos[sala];
        //  console.log(`Sala ${sala} eliminada por estar vacía`);
      } else {

        try {
          if (juegos[sala].jugadores[index].role !== 'espectador') {
            delete juegos[sala];
          }
        } catch (error) {
          console.error("error");
        }
      }

    }

    //   console.log(" los juego ////////////////////////////////////////////// --------", juegos);

  });
}
// console.log('\x1b[33m%s\x1b[0m', " -----botoens borrados - ", ' hora ', moment().format('hh:mm:ss'));
// console.table(juegos[sala])






//});  //FIN SOCKET

/* ----------------------------------------------------------------------------------
                      RANDOMIZAR LAS TARJETS DEL JUEGO
 ---------------------------------------------------------------------------------- */

function randomizarTarjetas(nivelJuevo) {
  var lista = fs.readFileSync('niveles/nivel' + nivelJuevo + '.json', 'utf-8');
  ////console.log("lista ",lista);
  //console.clear();

  listaTarjetas = [];
  listaTarjetas = JSON.parse(lista);

  //console.table(listaTarjetas);

  for (var i = 0; i < listaTarjetas.length; i++) {
    // --- guardar los valores para cambiar de posicion -------
    nombreAux = listaTarjetas[i].nombre;
    significadoAux = listaTarjetas[i].significado;
    imagenAux = listaTarjetas[i].imagen;
    sonidoAux = listaTarjetas[i].sonido;
    //
    numeroRandon = Math.floor(Math.random() * listaTarjetas.length);

    listaTarjetas[i].nombre = listaTarjetas[numeroRandon].nombre;
    listaTarjetas[i].significado = listaTarjetas[numeroRandon].significado;
    listaTarjetas[i].imagen = listaTarjetas[numeroRandon].imagen;
    listaTarjetas[i].sonido = listaTarjetas[numeroRandon].sonido;

    //
    listaTarjetas[numeroRandon].nombre = nombreAux;
    listaTarjetas[numeroRandon].significado = significadoAux;
    listaTarjetas[numeroRandon].imagen = imagenAux;
    listaTarjetas[numeroRandon].sonido = sonidoAux;

  }

}


// Añadir jugador a la sala si no existe
function anadirJugadorSiNoExiste(sala, jugadorData) {
  if (!jugadorExiste(sala, jugadorData.usuario)) {
    juegos[sala].jugadores.push(jugadorData);
  }
}

// Verificar si un jugador específico ya existe en la sala
function jugadorExiste(sala, nombreJugador) {
  return juegos[sala] && juegos[sala].jugadores.some(j => j.usuario === nombreJugador);
}


/* -----------------------------------------------------------------------------
                  VISUALIZAR U OCULTAR JUGADOR
------------------------------------------------------------------------------*/
function visulazarJugador(socket, visualizar) {

  const index = jugadoresAvatar.findIndex(jugador => jugador.socketid === socket)

  if (index !== -1) {
    jugadoresAvatar[index].visualizar = visualizar;
  }

  console.log("uno          *******************/ *c/ */as*vasd ")
  console.table(jugadoresAvatar)
}


function agregarTodasLasPalabras() {
  // Inicializar el array de palabras

  hideButton = [];
  palabras = [];

  if (listaTarjetas && listaTarjetas.length > 0) {
    palabras.push(...listaTarjetas);
    hideButton = new Array(listaTarjetas.length).fill(false);
    //  console.table(hideButton)



  }
}





function crearJugador(idTabla, usuario, nivel, socketId, urlAvatar, sala, turno, clic, role, ico) {
  // Inicializar la matriz botonesAbierto con 19 elementos vacíos

  const botonesAbiertos = [];

  // Función para agregar un nuevo botón a la matriz botonesAbierto
  function agregarBoton(index, nombre) {
    // Verificar si ya existe un botón con el mismo índice
    const existente = botonesAbiertos.findIndex(boton => boton.index === index);
    if (existente === -1) {
      // Si no existe, agregar el nuevo botón a la matriz
      botonesAbiertos.push({ index, nombre });
    } else {
      // Si ya existe, actualizar su nombre
      botonesAbiertos[existente].nombre = nombre;
    }
    // console.log('\x1b[33m%s\x1b[0m', " -----botoens abiertos - ", ' hora ', moment().format('hh:mm:ss'));
    // console.table(botonesAbiertos)
  }


  // Función para eliminar botones de la matriz botonesAbierto con el mismo nombre
  function eliminarBoton(nombre) {
    // Encontrar los índices de los botones en la matriz
    const indices = botonesAbiertos.reduce((acc, boton, index) => {
      if (boton.nombre === nombre) {
        acc.push(index);


        // juegos[sala].jugadores[0].hideButton[index] = true;
        // juegos[sala].jugadores[1].hideButton[index] = true;

        juegos[sala].jugadores.forEach(jugador => {
          jugador.hideButton[index] = true

          console.log("hizo click ", jugador.hideButton)
        });







      }
      return acc;
    }, []);

    // Eliminar los botones de la matriz
    indices.reverse().forEach(indice => {
      botonesAbiertos.splice(indice, 1);
    });

    // console.log('\x1b[33m%s\x1b[0m', " -----botoens borrados - ", ' hora ', moment().format('hh:mm:ss'));
    // console.table(botonesAbiertos)
  }




  function eliminarPalabra(nombre) {
    // Crear un array para almacenar los índices de las coincidencias
    let indices = [];

    // Encontrar todos los índices donde la palabra coincide
    palabras.forEach((palabra, index) => {
      if (palabra.nombre === nombre) {
        indices.push(index);
      }
    });

    // Imprimir los índices encontrados
    console.log("Índices encontrados para eliminar:", indices);

    // Eliminar las palabras del array en orden inverso para evitar problemas con los índices al cambiar el array
    for (let i = indices.length - 1; i >= 0; i--) {
      palabras.splice(indices[i], 1);
      hideButton[i] = false;
    }
  }


  // Agregar todas las palabras al array cuando se crea el jugador
  agregarTodasLasPalabras();

  // Objeto jugador
  let jugador = {
    idTabla,
    usuario,
    role,
    nivel,
    puntaje: 0,
    clic,
    indexUnoAux: 0,
    indexDosAux: 0,
    nombreImagenUno: null,
    nombreImagenDos: null,
    borrados: 0,
    juegoTerminado: false,
    hizoPareja: false,
    resultadofinal: "",
    mostrarAvatar: false,
    turno,
    socket: socketId,
    Ico: ico,
    urlAvatar,
    sala,
    botonesAbiertos,
    hideButton,
    palabras, // Asignando el array de palabras al jugador
    // Métodos para eliminar palabras
    eliminarPalabra,
    // Métodos para agregar y eliminar botones
    agregarBoton,
    eliminarBoton,
    tiempo: '',

  };

  console.log('\x1b[33m%s\x1b[0m', " -----JUGADORES EN SALA- ", ' hora ', moment().format('hh:mm:ss'));
  console.log(juegos[sala])

  return jugador;
}

// -------------------------------------------------------------------------------------------------------- //

app.get('/', (req, res) => {
  console.log("login coningplay");
 
  res.json({succes: true, message: 'hola'});
})


/* -------------------------------------------------------------------------------
CONSULTAR LOGIN POR USUAIRO Y CLAVE
                                        Http://localhost:3002/api/login/eli/1234 
---------------------------------------------------------------------------------*/
app.get('/api/login/:usuario/:clave/', async (req, res) => {

  console.log("login coningplay");
  const { usuario, clave } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("usuario", sql.NVarChar(50), usuario)
      .input("clave", sql.Char(4), clave)
      .query(queries.getLogin);
    res.json(result.recordset)

    console.table(result.recordset)

  } catch (error) {
    res.json({ "error": error.message })
  }
});

/* -------------------------------------------------------------------------------
ACTUALIZA PUNTOS JUGADOR
                                        Http://localhost:3002/api/login/eli/1234 
---------------------------------------------------------------------------------*/



// app.put('/api/jugadores/:id/:ico', async (req, res) => {
//   const { id, ico } = req.params;

//   //const { nombre, clave } = req.body;
//   try {
//     const pool = await getConnection();
//     const result = await pool.request()
//       .input('id', sql.Decimal, id)
//       .input('ico', sql.Int, ico)
//       .query(queries.updatePlayer);


//     if (result.recordset.length > 0) {
//       res.json({ message: 'Jugador actualizado correctamente', nuevoIco: result.recordset[0].ico });

//       console.log("ico actualizdo ", result.recordset[0].ico)

//     } else {
//       res.status(404).json({ error: 'Jugador no encontrado' });
//     }


//   } catch (error) {
//     console.error('Error durante la actualización del jugador:', error.message);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// });





// Función para actualizar el campo ico
async function actualizarIco(id, ico, resultadoFinal) {


  if (ico < 70) {
    ico = 70;
  }

  let ganadas = (resultadoFinal === 'gano') ? 1 : 0;
  let perdidas = (resultadoFinal === 'perdio') ? 1 : 0;
  let empatadas = (resultadoFinal === 'empato') ? 1 : 0;

  console.log(ganadas, ' ', perdidas, ' ', empatadas)

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('ico', sql.Int, ico)
      .input('Perdidas', sql.Int, perdidas)
      .input('Ganadas', sql.Int, ganadas)
      .input('Empatadas', sql.Int, empatadas)

      .query(queries.updatePlayer);
    return result;
  } catch (error) {
    console.error('Error durante la actualización del jugador:', error.message);
    throw error;
  }

  /*-------------------------------------------------------------------------------
     TRAER LOS VALORES DEL JUGADOR RANKING
                                            Http://localhost:3002/api/ranking/12 
  ---------------------------------------------------------------------------------*/






  // app.put('/api/jugadores/:id/:ico', async (req, res) => {
  //   const { id, ico } = req.params;

  //   //const { nombre, clave } = req.body;
  //   try {
  //     const pool = await getConnection();
  //     const result = await pool.request()
  //       .input('id', sql.Decimal, id)
  //       .input('ico', sql.Int, ico)
  //       .query(queries.updatePlayer);


  //     if (result.recordset.length > 0) {
  //       res.json({ message: 'Jugador actualizado correctamente', nuevoIco: result.recordset[0].ico });

  //       console.log("ico actualizdo ", result.recordset[0].ico)

  //     } else {
  //       res.status(404).json({ error: 'Jugador no encontrado' });
  //     }


  //   } catch (error) {
  //     console.error('Error durante la actualización del jugador:', error.message);
  //     res.status(500).json({ error: 'Error interno del servidor' });
  //   }
  // });

}

/* -------------------------------------------------------------------------------
CONSULTA RANKING
                                            http://localhost:3002/api/ranking/
---------------------------------------------------------------------------------*/

app.get('/api/ranking/', async (req, res) => {
  //const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      //      .input("ID", sql.Decimal, id) // Asegúrate que el tipo de dato es correcto
      .query(queries.getRanking);

    res.json(result.recordset);
    console.table(result.recordset);
  } catch (error) {
    console.error(error); // Log del error en el servidor
    res.status(500).json({ error: error.message });
  }

  console.log("ID recibido:"); // Esta línea es útil para depuración
});

/* -------------------------------------------------------------------------------
CONSULTAR JUGADOR POR ID
                                           http://localhost:3002/api/jugadorById/12
---------------------------------------------------------------------------------*/

app.get('/api/jugadorById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("ID", sql.Decimal, id)
      .query(queries.getJugadorById);

    res.json(result.recordset);
    console.table(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

  console.log("ID recibido:"); // Esta línea es útil para depuración
});



/* -------------------------------------------------------------------------------
UPDATA JUGADOR ViewAviso
                           http://localhost:3002/api/jugadorUpdateViewAvisoById/13
---------------------------------------------------------------------------------*/

app.put('/api/jugadorUpdateViewAvisoById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("ID", sql.Decimal, id)
      .query(queries.UpdateViewAvisoById);
    res.json({ message: `Jugador con ID ${id} actualizado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

///*asd*fa*sdasdfas doka