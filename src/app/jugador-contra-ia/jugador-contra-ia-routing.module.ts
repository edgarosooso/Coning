import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JugadorContraIaPage } from './jugador-contra-ia.page';

const routes: Routes = [
  {
    path: '',
    component: JugadorContraIaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JugadorContraIaPageRoutingModule {}
