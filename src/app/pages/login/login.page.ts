import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ApiService } from '@app/services/api.service';
import { User } from '@app/models/user';
import { HelperService } from '@app/services/helper-service.service';
import { EatsDate } from '@app/models/eats-date';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  loginFailed: boolean = false;
  user: User;

  constructor(public api: ApiService,
    public toastController: ToastController) { }

  login(){
    this.api.login(this.username, this.password).then(async success => {
      if(success) {
        this.loginFailed = false;
        this.api.getCurrentUser().then((value) => {
          this.user = HelperService.PopulateUser(value);
          console.log(this.user);
        });
      } else {
        this.loginFailed = true;
        this.user = null;
        const toast = await this.toastController.create({
          message: 'Incorrect Username/Password. Try again.',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  ngOnInit() {
  }

}
