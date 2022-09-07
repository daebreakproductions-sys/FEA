import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Market } from '@app/models/market';
import { Review } from '@app/models/review';
import { ApiService } from '@app/services/api.service';
import { HelperService } from '@app/services/helper-service.service';
import { ReviewService } from '@app/services/review.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.page.html',
  styleUrls: ['./review-detail.page.scss'],
})
export class ReviewDetailPage implements OnInit {
  public review: Review;
  public HelperService = HelperService;

  constructor(
    private route: ActivatedRoute,
    public reviewService: ReviewService,
    public router: Router,
    public userService: UserService,
    public apiService: ApiService,
  ) {
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.reviewService.byId(id).then(review => {
        this.review = review;
      })
    });
  }

  ngOnInit() {
  }

  likeAction() {
    if(this.review.iLike) {
      this.review.reactionCount -= 1;
      this.review.iLike = false;
    } else {
      // API Action
      this.review.reactionCount += 1;
      this.review.iLike = true;
    }
    this.apiService.toggleLike(this.review.id);
  }
  targetMarket(): Market {
    return <Market>this.review.target;
  }
  editReview() {
    this.router.navigate(['edit', 'review', this.review.id]);
  }
  marketDetail() {
    this.router.navigate(['detail', 'market', this.review.target.id]);
  }
}
