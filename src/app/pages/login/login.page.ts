import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user.service';
import { TagService } from '@app/services/tag.service';
import { environment } from '@app/../environments/environment';
import { Plugins } from '@capacitor/core';
import { EatsLocationsService } from '@app/services/eats-locations.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  loginFailed: boolean = false;

  @ViewChild('inputToFocus') inputToFocus;
  
  constructor(public api: ApiService,
    public toastController: ToastController,
    public auth: AuthService,
    public router: Router,
    public userService: UserService,
    public tagService: TagService,
    public locationsService: EatsLocationsService,
    ) { }

  login(){
    this.api.login(this.username, this.password).then(async success => {
      if(success) {
        this.loginFailed = false;
        
        // Also init these services in app.component.ts and signup.page.ts
        this.userService.init();
        this.tagService.init();
        this.locationsService.init();

        this.router.navigateByUrl(this.auth.getRedirectUrl());
      } else {
        this.loginFailed = true;
        const toast = await this.toastController.create({
          message: 'Incorrect Username/Password. Try again.',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  async resetPasswordLink() {
    const { App } = Plugins;
    await App.openUrl({
      url: environment.api_url + 'password-reset',
    });
  }

  ngOnInit() {
  }

  gotoPasswordField() {
    this.inputToFocus.setFocus();
  }
}
