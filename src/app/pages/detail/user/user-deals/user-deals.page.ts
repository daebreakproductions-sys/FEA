import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deal } from '@app/models/deal';
import { DealService } from '@app/services/deal.service';
import { UserService } from '@app/services/user.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-user-deals',
  templateUrl: './user-deals.page.html',
  styleUrls: ['./user-deals.page.scss'],
})
export class UserDealsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public deals: Deal[];
  public currentPage: number = 0;
  public pageLength: number = 10;
  public endOfFeed: boolean = false;
  public userId;

  constructor(
    public route: ActivatedRoute,
    public dealService: DealService,
    public userService: UserService,
  ) { }

  reset() {
    this.deals = [];
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
      this.dealService.byUser(this.userId, this.currentPage, this.pageLength).then(deals => {
        this.deals = this.deals.concat(deals);
        this.endOfFeed = (deals.length != this.pageLength);
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
