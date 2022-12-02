import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '@app/models/recipe';
import { RecipeService } from '@app/services/recipe.service';
import { UserService } from '@app/services/user.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.page.html',
  styleUrls: ['./user-recipes.page.scss'],
})
export class UserRecipesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public recipes: Recipe[];
  public currentPage: number = 0;
  public pageLength: number = 10;
  public endOfFeed: boolean = false;
  public userId;

  constructor(
    public route: ActivatedRoute,
    public recipeService: RecipeService,
    public userService: UserService,
  ) { }

  reset() {
    this.recipes = [];
    this.currentPage = 0;
    this.endOfFeed = false;
  }
  ngOnInit() {
    this.userId = this.route.snapshot.parent.parent.parent.params.id;
    this.reset();
    this.query();
  }
  query() {
    return new Promise<void>((resolve) => {
      this.recipeService.byUser(this.userId, this.currentPage, this.pageLength).then(recipes => {
        this.recipes = this.recipes.concat(recipes);
        this.endOfFeed = (recipes.length != this.pageLength);
        this.infiniteScroll.disabled = this.endOfFeed;
        resolve();
      });
    });
  }
  refreshFeed(event: any) {
    this.reset();
    this.query().then(() => {
      event.target.complete();
    });
  }
  nextPage(event: any) {
    this.currentPage += 1;
    this.query().then(() => {
      event.target.complete();
    });
  }
}
