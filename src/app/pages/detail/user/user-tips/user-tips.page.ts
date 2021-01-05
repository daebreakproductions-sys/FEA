import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tip } from '@app/models/tip';
import { TipService } from '@app/services/tip.service';
import { UserService } from '@app/services/user.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-user-tips',
  templateUrl: './user-tips.page.html',
  styleUrls: ['./user-tips.page.scss'],
})
export class UserTipsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public tips: Tip[];
  public currentPage: number = 0;
  public pageLength: number = 10;
  public endOfFeed: boolean = false;
  public userId;

  constructor(
    public route: ActivatedRoute,
    public tipService: TipService,
    public userService: UserService,
  ) { }

  reset() {
    this.tips = [];
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
      this.tipService.byUser(this.userId, this.currentPage, this.pageLength).then(tips => {
        this.tips = this.tips.concat(tips);
        this.endOfFeed = (tips.length != this.pageLength);
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
