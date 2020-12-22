import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { AddDealsPage } from '@app/pages/add/deals/add-deals.page';
import { DealService } from '@app/services/deal.service';

@Component({
  selector: 'app-edit-deals',
  templateUrl: './edit-deals.page.html',
  styleUrls: ['./edit-deals.page.scss'],
})
export class EditDealsPage implements OnInit {
  public dealForm: FormGroup;
  public validation_messages;
  public deal: Deal;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dealService: DealService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.dealService.byId(id).then(deal => {
      console.log(deal);
      this.loadFields(deal);
    })
    this.dealForm = AddDealsPage.newDealForm();
    this.validation_messages = AddDealsPage.validation_messages;
  }

  loadFields(deal: Deal) {
    this.deal = deal;
    this.dealForm.get('title').setValue(deal.title);
  }

}
