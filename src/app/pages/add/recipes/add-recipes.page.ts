import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  templateUrl: './add-recipes.page.html',
  styleUrls: ['./add-recipes.page.scss'],
})
export class AddRecipesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public static newRecipeForm() {
    return new FormGroup({
      title: new FormControl('', Validators.compose([
        Validators.maxLength(255),
        Validators.minLength(3),
        Validators.required
      ])),
      servings: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(1)
      ])),
      description: new FormControl(''),
      published: new FormControl(''),
    });
  }
  public static validation_messages_recipe = {
    'title': [
      { type: 'required', message: 'Title is required.' },
      { type: 'minlength', message: 'Title must be at least 3 characters long.' },
      { type: 'maxlength', message: 'Title cannot be more than 255 characters long.' },
    ],
    'servings': [
      { type: 'required', message: 'The number of Servings is required.' },
      { type: 'min', message: 'The number of Servings must be more than 0.' }
    ],
    'description': [],
    'published': [],
  };
  public static newRecipeStepForm() {
    return new FormGroup({
      title: new FormControl('', Validators.compose([
        Validators.maxLength(45),
        Validators.minLength(3),
        Validators.required
      ])),
      timeMinutes: new FormControl('', Validators.compose([
        Validators.required
      ])),
      instructions: new FormControl(''),
    });
  }
  public static validation_messages_step = {
    'title': [
      { type: 'required', message: 'Title is required.' },
      { type: 'minlength', message: 'Title must be at least 3 characters long.' },
      { type: 'maxlength', message: 'Title cannot be more than 45 characters long.' },
    ],
    'instructions': [],
    'timeMinutes': [
      { type: 'required', message: 'Prep Time cannot be blank.' },
    ],
  };
  public static newRecipeIngredientForm() {
    return new FormGroup({
      name: new FormControl('', Validators.compose([
        Validators.maxLength(255),
        Validators.minLength(3),
        Validators.required
      ])),
      measurement: new FormControl('', Validators.compose([
        Validators.maxLength(45)
      ])),
    });
  }
  public static validation_messages_ingredient = {
    'name': [
      { type: 'required', message: 'Ingredient Name is required.' },
      { type: 'minlength', message: 'Ingredient Name must be at least 3 characters long.' },
      { type: 'maxlength', message: 'Ingredient Name cannot be more than 255 characters long.' },
    ],
    'measurement': [
      { type: 'maxlength', message: 'Measurement cannot be more than 45 characters long.' },
    ],
  };
  // public static clearPickerOptions(dealForm: FormGroup, control: string) {
  //   return {
  //     buttons: [
  //       {
  //         text: 'Clear',
  //         handler: () => dealForm.controls[control].setValue(null)
  //       },
  //       {
  //         text: 'Done',
  //         handler: (data) => {
  //           let dt = new Date();
  //           dt.setFullYear(data.year.value);
  //           dt.setMonth(data.month.value - 1);
  //           dt.setDate(data.day.value);
  //           dealForm.controls[control].setValue(dt);
  //         }
  //       }
  //     ]
  //   };
  // }
}
