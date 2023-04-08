import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { EditableRecipeIngredient } from '@app/models/recipe-ingredient';
import { EditableRecipeStep } from '@app/models/recipe-step';
import { Tag } from '@app/models/tag';
import { AddRecipesPage } from '@app/pages/add/recipes/add-recipes.page';
import { RecipeService } from '@app/services/recipe.service';
import { TagService } from '@app/services/tag.service';
import { ActionSheetController, IonReorderGroup, ItemReorderEventDetail, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-recipes',
  templateUrl: './edit-recipes.page.html',
  styleUrls: ['./edit-recipes.page.scss'],
})
export class EditRecipesPage implements OnInit {
  public recipeForm: UntypedFormGroup;
  public validation_messages_recipe;
  public recipeIngredientForm: UntypedFormGroup;
  public validation_messages_ingredient;
  public recipeStepForm: UntypedFormGroup;
  public validation_messages_step;
  @ViewChild('reorderIngredients') reorderIngredients: IonReorderGroup;

  public clearPickerOptions: any;
  public recipe: Recipe;
  public tags: Tag[];
  public ingredients: EditableRecipeIngredient[];
  public steps: EditableRecipeStep[];

  public locationTouched: boolean = false;
  private readonly STEP_ORDER_START_COUNT: number = 1;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public recipeService: RecipeService,
    public modalController: ModalController,
    public tagService: TagService,
    public actionSheetController: ActionSheetController,
    public locationStrategy: LocationStrategy,
  ) {
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.recipeService.byId(id).then(recipe => {
        if(this.route.snapshot.queryParams['firstLoad']) {
          recipe.published = true;
        }
        this.loadFields(recipe);
      });
      this.recipeForm = AddRecipesPage.newRecipeForm();
      this.validation_messages_recipe = AddRecipesPage.validation_messages_recipe;
      this.recipeIngredientForm = AddRecipesPage.newRecipeIngredientForm();
      this.validation_messages_ingredient = AddRecipesPage.validation_messages_ingredient;
      this.recipeStepForm = AddRecipesPage.newRecipeStepForm();
      this.validation_messages_step = AddRecipesPage.validation_messages_step;
    });
  }

  ngOnInit() { }

  loadFields(recipe: Recipe) {
    this.recipe = recipe;
    this.ingredients = recipe.ingredients.map(ingred => {
      let newIngred = <EditableRecipeIngredient>ingred;
      newIngred.deleted = false;
      return newIngred;
    })
    .sort((a,b) => a.id - b.id);
    this.steps = recipe.steps.map(step => {
      let newStep = <EditableRecipeStep>step;
      newStep.deleted = false;
      return newStep;
    })
    .sort((a,b) => a.stepOrder - b.stepOrder);
  
    this.recipeForm.get('title').setValue(recipe.title);
    this.recipeForm.get('description').setValue(recipe.description);
    this.recipeForm.get('servings').setValue(recipe.servings);
    this.recipeForm.get('published').setValue(recipe.published);
  }

  // Ingredients
  editIngredient(ingred: EditableRecipeIngredient) {
    ingred.editing = true;
    this.recipeIngredientForm.get('measurement').setValue(ingred.measurement);
    this.recipeIngredientForm.get('name').setValue(ingred.name);
  }
  cancelIngredientEdit(ingred: EditableRecipeIngredient) {
    if(ingred.name == '') {
      this.ingredients.splice(this.ingredients.indexOf(ingred));
    } else {
      ingred.editing = false;
    }
  }
  saveIngredientEdit(ingred: EditableRecipeIngredient) {
    if(this.recipeIngredientForm.invalid) {
      this.recipeIngredientForm.markAllAsTouched();
    } else {
      ingred.edited = true;
      ingred.measurement = this.recipeIngredientForm.get('measurement').value;
      ingred.name = this.recipeIngredientForm.get('name').value;
      ingred.editing = false;
    }
  }
  addIngredient() {
    this.ingredients.push({
      deleted: false,
      edited: false,
      editing: true,
      name: '',
      measurement: ''
    });
    this.recipeIngredientForm.reset();
  }
  ingredientsEditing() {
    return this.ingredients.some((x) => x.editing);
  }

  // Steps
  editStep(step: EditableRecipeStep) {
    step.editing = true;
    this.recipeStepForm.get('title').setValue(step.title);
    this.recipeStepForm.get('instructions').setValue(step.instructions);
    this.recipeStepForm.get('timeMinutes').setValue(step.timeMinutes);
  }
  cancelStepEdit(step: EditableRecipeStep) {
    if(step.title == '') {
      this.steps.splice(this.steps.indexOf(step));
    } else {
      step.editing = false;
    }
  }
  saveStepEdit(step: EditableRecipeStep) {
    if(this.recipeStepForm.invalid) {
      this.recipeStepForm.markAllAsTouched();
    } else {
      step.edited = true;
      step.title = this.recipeStepForm.get('title').value;
      step.instructions = this.recipeStepForm.get('instructions').value;
      step.timeMinutes = this.recipeStepForm.get('timeMinutes').value;
      step.editing = false;
    }
  }
  addStep() {
    this.steps.push({
      deleted: false,
      edited: false,
      editing: true,
      title: '',
      instructions: '',
      image64: null,
      stepOrder: this.getNextStepOrder(),
      timeMinutes: 0
    });
    this.recipeStepForm.reset();
  }
  setStepPhoto(step: EditableRecipeStep, photo: string) {
    step.image64 = photo;
  }
  getNextStepOrder(): number {
    return this.steps.map(s => s.stepOrder).reduce((a, b) => Math.max(a, b), 0) + this.STEP_ORDER_START_COUNT;
  }
  stepsEditing() {
    return this.steps.some((x) => x.editing);
  }
  public stepsLocked = true;
  unlockSteps() {
    this.stepsLocked = false;
  }
  lockSteps() {
    this.stepsLocked = true;
  }
  doReorderSteps(ev: CustomEvent<ItemReorderEventDetail>) {
    ev.detail.complete();
    this.steps.splice(ev.detail.to, 0, this.steps.splice(ev.detail.from, 1)[0]);
    let count = this.STEP_ORDER_START_COUNT;
    this.steps.forEach(s => {
      s.edited = (s.stepOrder != count);
      s.stepOrder = count;
      count++;
    })
  }


  updateTags(tags: Tag[]) {
    this.tags = tags;
  }
  updateImage(image64) {
    this.recipe.image64 = image64;
  }
  saveRecipe = async () => {
    // Update Recipe Ingredients
    for (let index = 0; index < this.ingredients.length; index++) {
      const ingred = this.ingredients[index];
      if(ingred.deleted && ingred.id != null) {
        // Existing Ingredients that have been deleted
        await this.recipeService.deleteIngredient(this.recipe.id, ingred.id);
      } else if(ingred.edited && ingred.id != null) {
        // Existing Ingredients that have been edited
        await this.recipeService.updateIngredient(this.recipe.id, ingred);
      } else if(ingred.edited && ingred.id == null) {
        // New Ingredients that have been created
        await this.recipeService.createIngredient(this.recipe.id, ingred);
      }
    }

    // Update Recipe Steps
    for (let index = 0; index < this.steps.length; index++) {
      const step = this.steps[index];
      let tranmittable = {
        id: step.id,
        image: step.image64,
        stepOrder: step.stepOrder,
        title: step.title,
        instructions: step.instructions,
        timeMinutes: step.timeMinutes
      };
      if(step.deleted && step.id != null) {
        // Existing Ingredients that have been deleted
        await this.recipeService.deleteStep(this.recipe.id, step.id);
      } else if(step.edited && step.id != null) {
        // Existing Ingredients that have been edited
        await this.recipeService.updateStep(this.recipe.id, tranmittable);
      } else if(step.edited && step.id == null) {
        // New Ingredients that have been created
        await this.recipeService.createStep(this.recipe.id, tranmittable);
      }
    }

    // Update Recipe Base
    let newRecipe = {
      id: this.recipe.id,
      title: this.recipeForm.get('title').value,
      description: this.recipeForm.get('description').value,
      servings: this.recipeForm.get('servings').value,
      published: this.recipeForm.get('published').value,
      image: this.recipe.image64,
      tags: this.tags?.map(t => {
        return {id: t.id};
      })
    }
    this.recipeService.update(newRecipe).then( recipe => {
      if(this.route.snapshot.queryParams['firstLoad']) {
        this.router.navigate(['detail', 'recipe', recipe.id], {
          replaceUrl: true
        });
      } else {
        this.locationStrategy.back();
      }

      
    });
  }

}
