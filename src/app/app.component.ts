import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MarketService } from './services/market.service';
import { TagService } from './services/tag.service';
import { DealService } from './services/deal.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private marketService: MarketService,
    private tagService: TagService,
    private dealService: DealService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.marketService.init();
    this.tagService.init();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
