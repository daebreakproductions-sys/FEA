import { Component, OnInit } from '@angular/core';
import { Recipe } from '@app/models/recipe';
import { RecipeService } from '@app/services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  public recipes: Recipe[];

  constructor(
    public recipeService: RecipeService,
  ) { 
    this.recipes = [];
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.recipeService.myRecipes().then(mine => {
      this.recipeService.myFaveRecipes().then(faves => {
        let nonDuplicates = faves.filter((fTip) => {
          return !mine.some((mTip) => {
            return mTip.id == fTip.id;
          })
        });
        this.recipes = mine
          .concat(nonDuplicates)
          .sort((a,b) => {
            return Number(b.created.epochSecond - a.created.epochSecond); // Sort by date descending
          });
      });
    });
  }
}
