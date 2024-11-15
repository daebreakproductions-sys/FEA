import { Injectable } from '@angular/core';
import { Recipe } from '@app/models/recipe';
import { RecipeStep } from '@app/models/recipe-step';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';
import { UserService } from './user.service';
import { PgRecipeStep } from '@app/models/postgrest';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    public api: ApiService,
    public userService: UserService,
  ) { }

  byId(id: number) {
    return new Promise<Recipe>((resolve) => {
      this.api.getRecipe(id).then(recipe => {
        resolve(HelperService.PopulateRecipe(recipe));
      });
    });
  }

  async create(recipe: any) {
    return new Promise<Recipe>((resolve) => {
      this.api.createRecipe(recipe).then(id => {
        this.api.getRecipe(id).then(newRecipe => {
          resolve(HelperService.PopulateRecipe(newRecipe));
        })
      });
    })
  }  
  async update(recipe: any) {
    return new Promise<Recipe>((resolve) => {
      this.api.updateRecipe(recipe).then(id => {
        this.api.getRecipe(id).then(newRecipe => {
          resolve(HelperService.PopulateRecipe(newRecipe));
        })
      });
    })
  }
  async byUser(id: number, page: number = 0, pageLength: number = 10) {
    return new Promise<Recipe[]>((resolve) => {
      this.api.getUserContent(id, page, pageLength).then(ugcs => {
        let recipes: Recipe[];
        recipes = ugcs.filter(ugc => {
          return ugc.class.endsWith('Recipe');
        })
        .map(ugc => {
          return <Recipe>HelperService.PopulateEntity(ugc);
        });
        resolve(recipes);
      });
    });
  }

  myRecipes() {
    return new Promise<Recipe[]>((resolve) => {
      this.userService.getMyContent("Recipe").then(recipes => {
        resolve(recipes.map(ugc => {
          return <Recipe>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }
  myFaveRecipes() {
    return new Promise<Recipe[]>((resolve) => {
      this.userService.getMyFaves("Recipe").then(recipes => {
        resolve(recipes.map(ugc => {
          return <Recipe>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }

  async createIngredient(recipeId: number, ingredient: any) {
    return this.api.createRecipeIngredient(recipeId, ingredient);
  }  
  async updateIngredient(recipeId: number, ingredient: any) {
    return this.api.updateRecipeIngredient(recipeId, ingredient);
  }
  async deleteIngredient(recipeId: number, ingredientId: number) {
    return this.api.deleteRecipeIngredient(recipeId, ingredientId);
  }

  async createStep(recipeId: number, step: any) {
    return this.api.createRecipeStep(recipeId, step);
  }  
  async updateStep(recipeId: number, step: any) {
    return this.api.updateRecipeStep(recipeId, step);
  }
  async deleteStep(recipeId: number, stepId: number) {
    return this.api.deleteRecipeStep(recipeId, stepId);
  }

  static sumTime(steps: RecipeStep[]): Number {
    if(steps == null || steps.length == 0) {
      return 0;
    } else {
      return steps.map(i=>i.timeMinutes).reduce((a,b)=>a+b);
    }
  }

  static sumTimePg(steps: PgRecipeStep[]): Number {
    if(steps == null || steps.length == 0) {
      return 0;
    } else {
      return steps.map(i=>i.time_minutes).reduce((a,b)=>a+b);
    }
  }

}
