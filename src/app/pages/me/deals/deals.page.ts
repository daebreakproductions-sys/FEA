import { Component, OnInit } from '@angular/core';
import { Deal } from '@app/models/deal';
import { DealService } from '@app/services/deal.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.page.html',
  styleUrls: ['./deals.page.scss'],
})
export class DealsPage implements OnInit {
  public deals: Deal[];

  constructor(
    public dealService: DealService,
  ) { 
    this.deals = [];
  }

  ngOnInit() {
    this.dealService.byId(2899).then(deal => { //8115
      this.deals.push(deal);
    })
  }
}
