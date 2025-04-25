import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JugadoresEnSalaPageRoutingModule } from './jugadores-en-sala-routing.module';

import { JugadoresEnSalaPage } from './jugadores-en-sala.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JugadoresEnSalaPageRoutingModule
  ],
  declarations: [JugadoresEnSalaPage]
})
export class JugadoresEnSalaPageModule {}
