import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from '@app/models/new-user';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { EatsLocationsService } from '@app/services/eats-locations.service';
import { HelperService } from '@app/services/helper-service.service';
import { TagService } from '@app/services/tag.service';
import { UserService } from '@app/services/user.service';
import { PasswordValidator } from '@app/validators/password.validator';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signup_form: UntypedFormGroup;
  newUser: User;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public api: ApiService,
    public toastController: ToastController,
    public router: Router,
    public eatsLocationsService: EatsLocationsService,
    public userService: UserService,
    public tagService: TagService,
  ) {
    this.signup_form = new UntypedFormGroup({
      username: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      firstName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phone: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(\([0-9]{3}\)|[0-9]{3}-?) ?[0-9]{3}(-| )?[0-9]{4}$')
      ])),
      password: new UntypedFormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&\\*\\(\\)\\-_=\\+\\{\\}\\[\\]|\\\\:;"\'<>,\\.?\\/]).{8,}') //this is for the letters (both uppercase and lowercase) and numbers validation
     ])),
      passwordConfirm: new UntypedFormControl('')
    }, (formGroup: UntypedFormGroup) => {
      return PasswordValidator.passwordsSame(formGroup);
   });
  }

  public validation_messages = {
    'username': [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
        { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'You must enter a valid email address.' }
      ],
      'phone': [
        { type: 'required', message: 'A Phone number is required.' },
        { type: 'pattern', message: 'You must enter a valid phone number.' }
      ],
      'password': [
        { type: 'required', message: 'A Password is required.' },
        { type: 'minlength', message: 'Password must be at least 8 characters long.' },
        { type: 'pattern', message: 'You must include a number, uppercase and lowercase letter, and a symbol.' }
      ],
      'passwordConfirm': [
        // { type: 'required', message: 'A Password is required.' },
        { type: 'passwordsEqual', message: 'The passwords must match.' }
      ],
    };

  ngOnInit() {
  }

  public save() {
    let user: NewUser = <NewUser>this.signup_form.value;
    let username: string = user.username;
    let password: string = user.password;

    this.api.newUser(user).then(async result => {
      if(HelperService.isNumber(result)) {
        this.api.login(username, password).then(async success => {
          if(success) {
            // Also init these services in app.component.ts and login.page.ts
            this.userService.init();
            this.tagService.init();
            this.eatsLocationsService.init();
            this.router.navigate(['/tabs/nearby']);
          }
        });
      } else {
        const toast = await this.toastController.create({
          message: result + ' Please update your information and try again.',
          duration: 3000,
          position: 'middle'
        });
        toast.present();
      }
    })
    console.log(this.signup_form);
  }
}
