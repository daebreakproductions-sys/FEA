import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { Tag } from '@app/models/tag';
import { AddRecipesPage } from '@app/pages/add/recipes/add-recipes.page';
import { RecipeService } from '@app/services/recipe.service';
import { TagService } from '@app/services/tag.service';
import { ActionSheetController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-recipes',
  templateUrl: './edit-recipes.page.html',
  styleUrls: ['./edit-recipes.page.scss'],
})
export class EditRecipesPage implements OnInit {
  public recipeForm: FormGroup;
  public validation_messages_recipe;
  public clearPickerOptions: any;
  public recipe: Recipe;
  public tags: Tag[];

  public locationTouched: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public recipeService: RecipeService,
    public modalController: ModalController,
    public tagService: TagService,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.recipeService.byId(id).then(deal => {
      this.loadFields(deal);
    });
    this.recipeForm = AddRecipesPage.newRecipeForm();
    this.validation_messages_recipe = AddRecipesPage.validation_messages_recipe;
  }

  loadFields(recipe: Recipe) {
    this.recipe = recipe;
  
    this.recipeForm.get('title').setValue(recipe.title);
    this.recipeForm.get('description').setValue(recipe.description);
    this.recipeForm.get('servings').setValue(recipe.servings);
    this.recipeForm.get('published').setValue(recipe.published);
  }

  updateTags(tags: Tag[]) {
    this.tags = tags;
  }
  updateImage(image64) {
    this.recipe.image64 = image64;
  }
  saveRecipe() {
    // Update Recipe Ingredients
    // Update Recipe Steps
    // Update Recipe Base
    let newRecipe = {
      id: this.recipe.id,
      title: this.recipeForm.get('title').value,
      description: this.recipeForm.get('description').value,
      servings: this.recipeForm.get('servings').value,
      published: this.recipeForm.get('published').value,
      image: this.recipe.image64,
      tags: this.tags.map(t => {
        return {id: t.id};
      })
    }
    this.recipeService.update(newRecipe).then( recipe => {
      this.router.navigate(['detail', 'recipe', recipe.id]);
    });
  }

}
