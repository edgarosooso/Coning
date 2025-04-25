import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ConexionesService } from '../services/conexiones.service';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss', './ranking.page2.scss'],
})
export class RankingPage implements OnInit {
  @ViewChild('listaContent', { static: false }) listaContent!: ElementRef;

 
  jugadores: any[] = [];
  jugadoresAux: any[] = [];
  idJugador: number = 0;
  totalJugadores: number = 0;
  indexResaltado: number = -1;

  constructor(
    private conexionesService: ConexionesService,
    private navCtrl: NavController,
    private renderer: Renderer2,
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    this.idJugador = Number(localStorage.getItem('id'));

    this.conexionesService.getRankin().subscribe((datos) => {
      console.log(datos);
      if (datos.length > 0) {
        this.totalJugadores = datos.length;
        this.jugadoresAux = datos;
        this.startAddingPlayers();
      }
    });

   

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.regresar();
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.regresar();
  }

  startAddingPlayers() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.jugadoresAux.length) {
        // Clonar el objeto para no modificar el original
        const jugador: any = { ...this.jugadoresAux[index] };
        // Agregar el jugador a la lista
        this.jugadores.push(jugador);
        if (jugador.ID === this.idJugador) {
          this.indexResaltado = index;
        }
        index++;
      } else {
        // Limpiar el intervalo cuando se hayan agregado todos los jugadores
        clearInterval(interval);
      }
    }, 200);
  }

  regresar() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}



// import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
// import { ConexionesService } from '../services/conexiones.service';
// import { NavController, Platform } from '@ionic/angular';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-ranking',
//   templateUrl: './ranking.page.html',
//   styleUrls: ['./ranking.page.scss', './ranking.page2.scss'],
// })
// export class RankingPage implements OnInit {
//   @ViewChild('listaContent', { static: false }) listaContent!: ElementRef;

//   jugadores: any[] = [];
//   jugadoresAux: any[] = [];
//   idJugador: number = 0;
//   counter: any;
//   totalJugadores: number = 0;
//   indexResaltado: number = -1;

//   constructor(
//     private conexionesService: ConexionesService,
//     private navCtrl: NavController,
//     private renderer: Renderer2,
//     private platform: Platform,
//     private router: Router

//   ) { }

//   ngOnInit() {
//     this.idJugador = Number(localStorage.getItem('id'));

//     this.conexionesService.getRankin().subscribe((datos) => {
//       console.log(datos);
//       if (datos.length > 0) {
//         this.totalJugadores = datos.length;
//         this.jugadoresAux = datos;
//         this.startAddingPlayers();
//       }
//     });

//     this.platform.backButton.subscribeWithPriority(10, () => {
//       // Navegar a la página home
//       this.navCtrl.navigateRoot('/home');
//     });

//   }



//   @HostListener('window:popstate', ['$event'])
//   onPopState(event: any) {
//     this.navCtrl.navigateRoot('/home');
//   }

//   startAddingPlayers() {
//     let index = 0;
//     const interval = setInterval(() => {
//       if (index < this.jugadoresAux.length) {
//         // Clonar el objeto para no modificar el original
//         const jugador: any = { ...this.jugadoresAux[index] };

//         // Agregar el jugador a la lista
//         this.jugadores.push(jugador);

//         if (jugador.ID === this.idJugador) { // Resaltar el elemento número 12 (el índice es 11 porque comienza en 0)
//           this.indexReslatado = index;
//         }

//         index++;
//       } else {
//         // Limpiar el intervalo cuando se hayan agregado todos los jugadores
//         clearInterval(interval);
//       }
//     }, 200);
//   }

//   regresar() {
//     this.navCtrl.navigateRoot('/home');
//   }

// }