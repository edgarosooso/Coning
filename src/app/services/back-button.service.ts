import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {

  constructor(
    private platform: Platform,
    private router: Router,
    public navController: NavController,
    private alertController: AlertController,
  ) { }



  init() {
    this.platform.backButton.subscribeWithPriority(666666, () => {
      const currentUrl = this.router.url;
      if (currentUrl === '/home') {
        this.presentAlertConfirm('¿Desea salir del App?');
      } else {
        this.navController.back();
      }

    });
  }

  //------------------------------ ALERTA CONFIRMAR------------------------------------------*/
  async presentAlertConfirm(msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: msg,
      buttons: [
        {
          text: 'Si',
          id: 'confirm-button',
          handler: () => {
      
            App['exitApp'];
              
         
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
  }

}