import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { InitService } from './services/init-service.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private initService: InitService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.initService.initializeServicesOnce();
    
    this.platform.ready().then(() => {
      //StatusBar.styleDefault();
      SplashScreen.hide();
    });
  }
}
