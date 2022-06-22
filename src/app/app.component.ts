import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { MarketService } from './services/market.service';
import { TagService } from './services/tag.service';
import { DealService } from './services/deal.service';
import { UserService } from './services/user.service';
import { FoodPantrySiteService } from './services/foodpantrysite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private marketService: MarketService,
    private foodPantrySiteService: FoodPantrySiteService,
    private tagService: TagService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Also init these services in login.page.ts
    this.marketService.init();
    this.foodPantrySiteService.init();
    this.tagService.init();
    this.userService.init();
    
    this.platform.ready().then(() => {
      //StatusBar.styleDefault();
      SplashScreen.hide();
    });
  }
}
