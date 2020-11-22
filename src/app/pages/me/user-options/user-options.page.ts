import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { PasswordValidator } from '@app/validators/password.validator';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.page.html',
  styleUrls: ['./user-options.page.scss'],
})
export class UserOptionsPage implements OnInit {
  user: User;
  fileToUpload: File;
  password_change_form: FormGroup;
  
  constructor(
    public api: ApiService,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public auth: AuthService,
    public router: Router,
    ) { 
      this.password_change_form = new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
       ])),
        passwordConfirm: new FormControl('')
      }, (formGroup: FormGroup) => {
        return PasswordValidator.passwordsSame(formGroup);
      });
    }

    public validation_messages = {
        'password': [
          { type: 'required', message: 'A Password is required.' },
          { type: 'minlength', message: 'Password must be at least 5 characters long.' },
          { type: 'pattern', message: 'You must include a number, uppercase, and lowercase letter.' }
        ],
        'passwordConfirm': [
          // { type: 'required', message: 'A Password is required.' },
          { type: 'passwordsEqual', message: 'The passwords must match.' }
        ],
      };

  async ngOnInit() {
    this.user = await this.api.getCurrentUser();
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            resolve('');
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = reader.result.toString();
            resolve(text);

        };

        reader.readAsDataURL(file);
    });
  }
  
  attachFile(e){
    if (e.target.files.length == 0) {
      console.log("No file selected!");
      return
    }
    let file: File = e.target.files[0];
    this.fileToUpload = file;
    this.readFileContent(file).then(contents => {
      this.api.uploadAvatar(contents.split(',')[1]).then(async id => {
        this.user = await this.api.getCurrentUser(true);
      });
    });
  }

  updatePassword() {
    let newPass: string = this.password_change_form.value.password;
    let user: User = this.user;
    let message: string = 'Password Updated.';
    this.api.updatePassword(newPass).then(async id => {
      if(Number(id) == Number(user.id)) {
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
}
