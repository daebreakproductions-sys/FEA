import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  loginFailed: boolean = false;

  constructor(public api: ApiService,
    public toastController: ToastController) { }

  login(){
    console.log("login");
    this.api.login(this.username, this.password).then(async success => {
      if(success) {
        this.loginFailed = false;
      } else {
        this.loginFailed = true;
        const toast = await this.toastController.create({
          message: 'Incorrect Username/Password. Try again.',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      }
    });
  }

  ngOnInit() {
  }

}
