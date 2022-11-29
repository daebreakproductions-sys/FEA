import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramVersions } from '@app/models/program-versions';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { HelperService } from '@app/services/helper-service.service';
import { PasswordValidator } from '@app/validators/password.validator';
import { AlertButton, AlertController, ToastController } from '@ionic/angular';
import { default as packageJson } from '../../../../../package.json';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.page.html',
  styleUrls: ['./user-options.page.scss'],
})
export class UserOptionsPage implements OnInit {
  user: User;
  fileToUpload: File;
  password_change_form: FormGroup;
  public serverVersions: ProgramVersions;
  public clientVersion: string = packageJson.version;
  
  constructor(
    public api: ApiService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public auth: AuthService,
    public router: Router,
    public alertController: AlertController,
    ) { 
      this.password_change_form = new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.minLength(8),
          Validators.required,
          Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&\\*\\(\\)\\-_=\\+\\{\\}\\[\\]|\\\\:;"\'<>,\\.?\\/]).{8,}') //this is for the letters (both uppercase and lowercase), numbers, and special character validation
       ])),
        passwordConfirm: new FormControl('')
      }, (formGroup: FormGroup) => {
        return PasswordValidator.passwordsSame(formGroup);
      });
      this.api.getServerVersion().then(versions => {
        this.serverVersions = versions;
      });
    }

    public validation_messages = {
        'password': [
          { type: 'required', message: 'A Password is required.' },
          { type: 'minlength', message: 'Password must be at least 8 characters long.' },
          { type: 'pattern', message: 'You must include a number, uppercase, and lowercase letter, and a special symbol.' }
        ],
        'passwordConfirm': [
          // { type: 'required', message: 'A Password is required.' },
          { type: 'passwordsEqual', message: 'The passwords must match.' }
        ],
      };

  async ngOnInit() {
    this.user = await this.api.getCurrentUser();
  }

  attachFile(e) {
    if (e.target.files.length == 0) {
      console.log("No file selected!");
      return
    }
    let file: File = e.target.files[0];
    this.fileToUpload = file;
    HelperService.readFileContent(file).then(contents => {
      this.api.uploadAvatar(contents.split(',')[1]).then(async id => {
        this.user = await this.api.getCurrentUser(true);
        this.fileToUpload = null;
      });
    });
  }

  updatePassword() {
    let newPass: string = this.password_change_form.value.password;
    let user: User = this.user;
    let message: string = 'Password Updated.';
    this.api.updatePassword(newPass).then(async messages => {
      if(messages.length == 0) {
        this.api.login(user.username, newPass);
      } else {
        message = 'Could not update password, try again with a different password.'
      }
      const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    });
  }

  logout() {
    this.auth.clearAccessToken();
    this.router.navigateByUrl('/login');
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete your account?',
      subHeader: 'Permanently delete',
      message: 'Are you sure you want to permanently delete your account and all data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        } as AlertButton,
        {
          text: 'Delete',
          role: 'destructive'
        } as AlertButton
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if(role == 'destructive') {
      console.log("Deleting User");
      this.api.deleteCurrentUser();
      this.logout();
    }
  }
}
