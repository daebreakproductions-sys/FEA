import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { Recipe } from '@app/models/recipe';
import { Review } from '@app/models/review';
import { Tip } from '@app/models/tip';
import { UGC } from '@app/models/ugc';
import { ApiService } from '@app/services/api.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-eats-ugc-card',
  templateUrl: './eats-ugc-card.component.html',
  styleUrls: ['./eats-ugc-card.component.scss'],
})
export class EatsUgcCardComponent implements OnInit {
  @Input() ugc: UGC;
  public type: string;

  public deal: Deal = null;
  public tip: Tip = null;
  public review: Review = null;
  public recipe: Recipe = null;

  constructor(
    public router: Router,
    public apiService: ApiService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    console.log(this.ugc)
    let type = this.ugc.class.split('.').pop();
    this.type = type;
    switch(type) {
      case "Deal":
        this.deal = <Deal>this.ugc;
        break;
      
      case "Tip":
        this.tip = <Tip>this.ugc;
        break;
      
      case "Review":
        this.review = <Review>this.ugc;
        break;
      
      case "Recipe":
        this.recipe = <Recipe>this.ugc;
        break;
    }
  }

  goToDetail() {
    this.router.navigate(['detail', this.type.toLowerCase(), this.ugc.id]);
  }
  likeAction() {
    if(this.ugc.iLike) {
      this.ugc.reactionCount -= 1;
      this.ugc.iLike = false;
    } else {
      // API Action
      this.ugc.reactionCount += 1;
      this.ugc.iLike = true;
    }
    this.apiService.toggleLike(this.ugc.id);
  }

}
