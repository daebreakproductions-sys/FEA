import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deal } from '@app/models/deal';
import { DealService } from '@app/services/deal.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user-deals',
  templateUrl: './user-deals.page.html',
  styleUrls: ['./user-deals.page.scss'],
})
export class UserDealsPage implements OnInit {
  public deals: Deal[];

  constructor(
    public route: ActivatedRoute,
    public dealService: DealService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.parent.parent.parent.params.id;
    console.log(this.route)
    this.userService.getUser(id).then(usr => {
      this.dealService.byUser(id).then(deals => {
        this.deals = deals.sort((a,b) => {
          return Number(a.created.epochSecond) - Number(b.created.epochSecond);
        }).map(deal => {
          deal.usr = usr;
          return deal;
        });
      });
    });
  }

}
