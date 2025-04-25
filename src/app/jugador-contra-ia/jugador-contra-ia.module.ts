import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JugadorContraIaPageRoutingModule } from './jugador-contra-ia-routing.module';

import { JugadorContraIaPage } from './jugador-contra-ia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JugadorContraIaPageRoutingModule
  ],
  declarations: [JugadorContraIaPage]
})
export class JugadorContraIaPageModule {}
