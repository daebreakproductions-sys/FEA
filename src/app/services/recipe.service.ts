import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    public api: ApiService,
  ) { 
    
  }

  byId(id: number) {
    return this.api.getRecipe(id);
  }
}
