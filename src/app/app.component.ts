import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { BackButtonService } from './services/back-button.service';
import { SplashScreen } from '@capacitor/splash-screen';


SplashScreen.show({
  showDuration: 5000,
  autoHide: true
});


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private backButtonService: BackButtonService,
  ) {
    this.initializeApp();

  }
  initializeApp() {

    this.platform.ready().then(() => {
      this.backButtonService.init();

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
      });

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN);
      });


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.BLUETOOTH);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.BLUETOOTH);
      });




      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION);
      });

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
      });


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_SCAN).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.BLUETOOTH_SCAN);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.BLUETOOTH_SCAN);
      });


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE);
      });

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT);
      });


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then((result) => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission
            (this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        }
      }, (err) => {
        this.androidPermissions.requestPermission
          (this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
      });

    });


  }


}
