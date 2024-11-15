import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { PgDeal, PgReview, PgUGC } from '@app/models/postgrest';
import { Recipe } from '@app/models/recipe';
import { Review } from '@app/models/review';
import { Tip } from '@app/models/tip';
import { UGC } from '@app/models/ugc';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { HelperService } from '@app/services/helper-service.service';
import { RecipeService } from '@app/services/recipe.service';
import { ReviewService } from '@app/services/review.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-pg-eats-ugc-card',
  templateUrl: './eats-pg-ugc-card.component.html',
  styleUrls: ['./eats-pg-ugc-card.component.scss'],
})
export class EatsPgUgcCardComponent implements OnInit {
  @Input() ugc: PgUGC;
  public type: string;
  public user: User;

  // public deal: Deal = null;
  // public tip: Tip = null;
  // public review: Review = null;
  // public recipe: Recipe = null;

  public RecipeService = RecipeService;
  public ReviewService = ReviewService;

  constructor(
    public router: Router,
    public apiService: ApiService,
    public userService: UserService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    if(this.ugc.deal != null) {
      this.type = "Deal"
    } else if(this.ugc.tip != null) {
      this.type = "Tip"
    } else if(this.ugc.review != null) {
      this.type = "Review"
    } else if(this.ugc.recipe != null) {
      this.type = "Recipe"
    }
    this.userService.getUser(this.ugc.usr.id).then(user => {
      this.user = user;
    })
  }

  goToDetail() {
    this.router.navigate(['detail', this.type.toLowerCase(), this.ugc.id]);
  }
  likeAction() {
    if(this.authService.isAuthenticated()) {
      console.log(this.ugc.reaction)
      if(this.iLike()) {
        this.ugc.reaction = this.ugc.reaction.filter((u) => u.user_id != this.userService.me.id);
      } else {
        // API Action
        this.ugc.reaction.push({
          user_id: this.userService.me.id
        })
      }
      // API Action
      this.apiService.toggleLike(this.ugc.id);
    } else {
      this.authService.launchLoginAlert('detail/' + this.type.toLowerCase() + '/' + this.ugc.id);
    }
  }
  reviewRating(review: PgReview): number {
    return review.reviewproperty.length == 0 ? 0 :
      review.reviewproperty.reduce((acc, b) => acc + b.value, 0) / review.reviewproperty.length
  }
  iLike() {
    if(this.userService.me) {
      return this.ugc.reaction.some((u) => u.user_id == this.userService.me.id);
    } else {
      return false;
    }
  }

}
