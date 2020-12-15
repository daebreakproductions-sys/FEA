import { Component, OnInit } from '@angular/core';
import { Deal } from '@app/models/deal';
import { DealService } from '@app/services/deal.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.page.html',
  styleUrls: ['./deals.page.scss'],
})
export class DealsPage implements OnInit {
  public deals: Deal[] = [];

  constructor(
    public dealService: DealService,

  ) { }

  ngOnInit() {
    this.dealService.myDeals().then(mine => {
      this.dealService.myFaveDeals().then(faves => {
        this.deals = mine.concat(faves).sort((a,b) => {
          return Number(a.created.epochSecond - b.created.epochSecond);
        });
      });
    });
  }
}
