import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { InitService } from './services/init-service.service';
import { register } from 'swiper/element/bundle';
import { VitalityUpdateModalComponent } from './components/vitality-update-modal/vitality-update-modal.component';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private initService: InitService,
    private modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.initService.initializeServicesOnce();
    
    this.platform.ready().then(async () => {
      SplashScreen.hide();
      
      // Show vitality update modal
      await this.showVitalityUpdateModal();
    });
  }

  async showVitalityUpdateModal() {
    const modal = await this.modalCtrl.create({
      component: VitalityUpdateModalComponent,
      cssClass: 'vitality-update-modal'
    });
    await modal.present();
  }
}
