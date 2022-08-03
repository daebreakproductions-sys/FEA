import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { RecipeService } from '@app/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  public recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    public recipeService: RecipeService,
  ) { 
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.recipeService.byId(id).then(recipe => {
        this.recipe = recipe;
      })
    });
  }

  ngOnInit() {
  }

}
