import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { RecipeStep } from '@app/models/recipe-step';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { RecipeService } from '@app/services/recipe.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  public recipe: Recipe;
  public RecipeService = RecipeService;

  constructor(
    private route: ActivatedRoute,
    public recipeService: RecipeService,
    public router: Router,
    public userService: UserService,
    public apiService: ApiService,
    private authService: AuthService,
  ) { 
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.recipeService.byId(id).then(recipe => {
        recipe.steps = recipe.steps.sort((a,b) => a.stepOrder - b.stepOrder);
        recipe.ingredients = recipe.ingredients.sort((a,b) => a.id - b.id);
        this.recipe = recipe;
      })
    });
  }

  ngOnInit() {
  }

  likeAction() {
    if(this.authService.isAuthenticated()) {
      if(this.recipe.iLike) {
        this.recipe.reactionCount -= 1;
        this.recipe.iLike = false;
      } else {
        // API Action
        this.recipe.reactionCount += 1;
        this.recipe.iLike = true;
      }
      this.apiService.toggleLike(this.recipe.id);
    } else {
      this.authService.launchLoginAlert(this.router.url);
    }
  }
  editRecipe() {
    this.router.navigate(['edit', 'recipe', this.recipe.id]);
  }
  sortStepsByOrder(stepA: RecipeStep, stepB: RecipeStep) {
    return stepA.stepOrder - stepB.stepOrder;
  }
}
