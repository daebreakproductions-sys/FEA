import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { Tag } from '@app/models/tag';
import { RecipeService } from '@app/services/recipe.service';
import { TagService } from '@app/services/tag.service';
import { ActionSheetController, IonSearchbar, IonSlides, ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './add-recipes.page.html',
  styleUrls: ['./add-recipes.page.scss'],
})
export class AddRecipesPage implements OnInit {
  @ViewChild(IonSlides) slider: IonSlides;
  public recipeForm: FormGroup;
  public validation_messages;

  public recipe: Recipe;
  public tags: Tag[];
  public tagStrings: string[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  public nextButton = {
    text: 'Location',
    show: true,
    disabled: true
  }
  public prevButton = {
    text: 'Title',
    show: false,
    disabled: false
  }
  public showSaveButton: boolean = false;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public recipeService: RecipeService,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public tagService: TagService,
  ) { 
    this.recipeForm = AddRecipesPage.newRecipeForm();
    this.validation_messages = AddRecipesPage.validation_messages_recipe;
  }

  ngOnInit() {
    this.resetDeal();
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.recipeForm.reset();
    this.resetDeal();
  }
  resetDeal() {
    this.recipe = {
      image64: null,
      title: '',
      description: '',
      servings: 0,
      tags: [],
      published: false,
      steps: [],
      ingredients: []
    }
  }
  ngAfterViewInit() {
    for(let control in this.recipeForm.controls) {
      let form: AbstractControl = this.recipeForm.controls[control];
      form.statusChanges
        .pipe(debounceTime(400))
        .subscribe(() => {
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
            this.updateSlideUI();
          }, 25);
        });
    }
    this.updateSlideUI();
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

  updateImage(image64) {
    this.recipe.image64 = image64;
    this.updateHeight();
  }
  updateTags(tags: Tag[]) {
    this.tags = tags;
    this.updateHeight();
  }
  getTagStrings(): string[] {
    return ["grape"];
  }

  updateHeight() {
    setTimeout(() => {
      this.slider.updateAutoHeight(225);
      this.updateSlideUI();
    }, 25);
  }
  updateSlideUI() {
    this.slider.getActiveIndex().then(slideNumber => {
      // Determine lock/unlock for slides
      // Title, Picture, Details, Location, Tags, Description
      let locked = false;
      switch(slideNumber) { 
        case 0:
          // Title
          locked = !this.checkStep1();
          this.nextButton.text = 'Description';
          break;
        case 1:
          // Description
          setTimeout(() => {
            this.slider.updateAutoHeight(175);
          }, 75);
          locked = !this.checkStep2();
          this.prevButton.text = 'Title';
          this.nextButton.text = 'Servings';
          break;
        case 2:
          // Servings
          locked = !this.checkStep3();
          this.prevButton.text = 'Description';
          this.nextButton.text = 'Picture';
          break;
        case 3:
          // Picture
          setTimeout(() => {
            this.slider.updateAutoHeight(175);
          }, 75);
          locked = !this.checkStep4();
          this.prevButton.text = 'Servings';
          this.nextButton.text = 'Tags';
          break;
        case 4:
          // Tags
          //this.loadTags();
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
          }, 25);
          locked = !this.checkStep5();
          this.prevButton.text = 'Picture';
          break;
      }
      this.slider.lockSwipeToNext(locked);
      this.nextButton.disabled = locked;
      this.prevButtonVisible(slideNumber);
      this.nextButtonVisible(slideNumber);
      this.saveButtonVisible(slideNumber);
    });
  }

  saveRecipe() {
    // Update Recipe Base
    let newRecipe = {
      id: this.recipe.id,
      title: this.recipeForm.get('title').value,
      description: this.recipeForm.get('description').value,
      servings: this.recipeForm.get('servings').value,
      published: false,
      image: this.recipe.image64,
      tags: this.tags.map(t => {
        return {id: t.id};
      })
    }
    this.recipeService.update(newRecipe).then( recipe => {
      this.router.navigate(['detail', 'recipe', recipe.id]);
    });
    this.recipeService.create(newRecipe).then( async recipe => {
      for (let index = 0; index < this.tags.length; index++) {
        const tag = this.tags[index];
        await this.tagService.tagItem(Number(recipe.id), tag);
      }
      this.router.navigate(['edit', 'recipe', recipe.id]);
    });
  }

  prevButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 0:
        this.prevButton.show = false;
        break;
      default:
        this.prevButton.show = true;
    }
  }
  nextButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 4:
        this.nextButton.show = false;
        break;
      default:
        this.nextButton.show = true;
    }
  }
  saveButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 4:
        this.showSaveButton = true;
        break;
      default:
        this.showSaveButton = false;
    }
  }

  nextClick() {
    if(!this.nextButton.disabled) {
      this.slider.slideNext();
    }
  }
  prevClick() {
    if(!this.prevButton.disabled) {
      this.slider.slidePrev();
    }
  }

  // Title, Description, Servings, Picture, Tags
  // These all return true if they are valid
  checkStep1(): boolean {
    // Title
    return this.recipeForm.controls['title'].valid;
  }
  checkStep2(): boolean {
    // Description
    return this.recipeForm.controls['description'].valid;
  }
  checkStep3(): boolean {
    // Servings
    return this.recipeForm.controls['servings'].valid;
  }
  checkStep4(): boolean {
    // Picture
    return true;
  }
  checkStep5(): boolean {
    // Tags
    return true;
  }
}
