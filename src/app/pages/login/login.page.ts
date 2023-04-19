import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '@app/../environments/environment';
import { AppLauncher } from '@capacitor/app-launcher';
import { InitService } from '@app/services/init-service.service';
import { UserService } from '@app/services/user.service';


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
    private initService: InitService,
    private userService: UserService,
  ) { }

  login(){
    this.api.login(this.username, this.password).then(async success => {
      if(success) {
        this.loginFailed = false;
        
        this.initService.initializeServicesOnce();
        this.userService.init();

        this.router.navigateByUrl(this.auth.getRedirectUrl(), { replaceUrl: true });
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
    await AppLauncher.openUrl({
      url: environment.api_url + 'password-reset',
    });
  }

  ngOnInit() {
  }

  gotoPasswordField() {
    this.inputToFocus.setFocus();
  }
}
