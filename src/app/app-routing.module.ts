import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'jugador-contra-ia',
    loadChildren: () => import('./jugador-contra-ia/jugador-contra-ia.module').then( m => m.JugadorContraIaPageModule)
  },
  {
    path: 'juego-terminado',
    loadChildren: () => import('./juego-terminado/juego-terminado.module').then( m => m.JuegoTerminadoPageModule)
  },
  {
    path: 'espectadores',
    loadChildren: () => import('./espectadores/espectadores.module').then( m => m.EspectadoresPageModule)
  },
  {
    path: 'jugadores-en-sala',
    loadChildren: () => import('./jugadores-en-sala/jugadores-en-sala.module').then( m => m.JugadoresEnSalaPageModule)
  },
  {
    path: 'sala-espera',
    loadChildren: () => import('./sala-espera/sala-espera.module').then( m => m.SalaEsperaPageModule)
  },
  {
    path: 'jugador-contra-jugador',
    loadChildren: () => import('./jugador-contra-jugador/jugador-contra-jugador.module').then( m => m.JugadorContraJugadorPageModule)
  },
  {
    path: 'ranking',
    loadChildren: () => import('./ranking/ranking.module').then( m => m.RankingPageModule)
  }
  
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
