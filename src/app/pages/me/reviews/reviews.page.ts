import { Component, OnInit } from '@angular/core';
import { Review } from '@app/models/review';
import { ReviewService } from '@app/services/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  public reviews: Review[];

  constructor(
    public reviewService: ReviewService,
  ) { 
    this.reviews = [];
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.reviewService.myReviews().then(mine => {
      this.reviewService.myFaveReviews().then(faves => {
        let nonDuplicates = faves.filter((fTip) => {
          return !mine.some((mTip) => {
            return mTip.id == fTip.id;
          })
        });
        this.reviews = mine
          .concat(nonDuplicates)
          .sort((a,b) => {
            return Number(b.created.epochSecond - a.created.epochSecond); // Sort by date descending
          });
      });
    });
  }
}
