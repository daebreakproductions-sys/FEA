import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from '@app/models/review';
import { ReviewService } from '@app/services/review.service';
import { UserService } from '@app/services/user.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.page.html',
  styleUrls: ['./user-reviews.page.scss'],
})
export class UserReviewsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public reviews: Review[];
  public currentPage: number = 0;
  public pageLength: number = 10;
  public endOfFeed: boolean = false;
  public userId;

  constructor(
    public route: ActivatedRoute,
    public reviewService: ReviewService,
    public userService: UserService,
  ) { }

  reset() {
    this.reviews = [];
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
      this.reviewService.byUser(this.userId, this.currentPage, this.pageLength).then(reviews => {
        this.reviews = this.reviews.concat(reviews);
        this.endOfFeed = (reviews.length != this.pageLength);
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
