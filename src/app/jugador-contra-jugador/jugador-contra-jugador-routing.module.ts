import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JugadorContraJugadorPage } from './jugador-contra-jugador.page';

const routes: Routes = [
  {
    path: '',
    component: JugadorContraJugadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JugadorContraJugadorPageRoutingModule {}
