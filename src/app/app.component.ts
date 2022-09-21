import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TagService } from './services/tag.service';
import { UserService } from './services/user.service';
import { EatsLocationsService } from './services/eats-locations.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private locationsService: EatsLocationsService,
    private tagService: TagService,
    private userService: UserService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Also init these services in login.page.ts and signup.page.ts
    this.locationsService.init();
    this.tagService.init();
    this.userService.init();
    
    this.platform.ready().then(() => {
      //StatusBar.styleDefault();
      SplashScreen.hide();
    });
  }
}
