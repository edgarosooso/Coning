import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JugadorContraJugadorPageRoutingModule } from './jugador-contra-jugador-routing.module';

import { JugadorContraJugadorPage } from './jugador-contra-jugador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JugadorContraJugadorPageRoutingModule
  ],
  declarations: [JugadorContraJugadorPage]
})
export class JugadorContraJugadorPageModule {}
