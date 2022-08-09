import { Injectable } from '@angular/core';
import { Recipe } from '@app/models/recipe';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    public api: ApiService,
  ) { 
    
  }

  byId(id: number) {
    return new Promise<Recipe>((resolve) => {
      this.api.getRecipe(id).then(recipe => {
        resolve(HelperService.PopulateRecipe(recipe));
      });
    });
  }
}
