import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { EatsDate } from '@app/models/eats-date';
import { Entity } from '@app/models/entity';
import { Tag } from '@app/models/tag';
import { UGC } from '@app/models/ugc';
import { AddDealsPage } from '@app/pages/add/deals/add-deals.page';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { DealService } from '@app/services/deal.service';
import { HelperService } from '@app/services/helper-service.service';
import { TagService } from '@app/services/tag.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-deals',
  templateUrl: './edit-deals.page.html',
  styleUrls: ['./edit-deals.page.scss'],
})
export class EditDealsPage implements OnInit {
  public dealForm: FormGroup;
  public validation_messages;
  public clearPickerOptions: any;
  public deal: Deal;
  public tags: Tag[];

  public minDate: string;
  public maxDate: string;
  public now: string;

  public locationTouched: boolean = false;

  public imageToUpload: File;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dealService: DealService,
    public modalController: ModalController,
    public tagService: TagService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.dealService.byId(id).then(deal => {
      console.log(deal);
      this.loadFields(deal);
    });
    this.dealForm = AddDealsPage.newDealForm();
    this.validation_messages = AddDealsPage.validation_messages;
    this.clearPickerOptions = AddDealsPage.clearPickerOptions(this.dealForm, 'endDate');
    this.maxDate = this._maxDate();
  }

  loadFields(deal: Deal) {
    this.deal = deal;
  
    this.minDate = this._minDate();
    this.now = this._now();
  
    this.dealForm.get('title').setValue(deal.title);
    this.dealForm.get('description').setValue(deal.text);
    this.dealForm.get('startDate').setValue((<EatsDate>deal.startDate).toDate());
    this.dealForm.get('endDate').setValue((<EatsDate>deal.endDate).toDate());
    this.dealForm.get('price').setValue(deal.price);

    this.tagService.byEntityId(this.deal.id).then(tags => {
      this.tags = tags;
    });
  }

  async presentMarketModal() {
    const modal = await this.modalController.create({
      component: MarketModalPage
    });
    modal.present();
    await modal.onWillDismiss().then(market => {
      this.deal.market = market.data;
      this.locationTouched = true;
    });
  }
  async presentTagModal() {
    const modal = await this.modalController.create({
      component: TagModalPage,
      componentProps: {
        initialTags: this.tags,
      }
    });
    modal.present();
    await modal.onWillDismiss().then(tags => {
      console.log(tags)
      if(tags.data != null) {
        this.tags = tags.data;
      }
    });
  }

  readonly oneMonth: number = 1000 * 60 * 60 * 24 * 30;
  private _minDate() {
    let now = new Date();
    let original = new Date(this.deal.startDate.toDate());
    now.setTime(Math.min(Date.now() - this.oneMonth, original.getTime()));
    return now.toISOString();
  }
  private _maxDate() {
    let now = new Date();
    now.setTime(Date.now() + this.oneMonth);
    return now.toISOString();
  }
  private _now() {
    let dt = new Date();
    return dt.toISOString();
  }
  attachFile(e) {
    if (e.target.files.length == 0) {
      console.log("No file selected!");
      return
    }
    let file: File = e.target.files[0];
    this.imageToUpload = file;
    HelperService.readFileContent(file).then(contents => {
      this.deal.image64 = contents.split(',')[1];
      this.imageToUpload = null;
    });
  }

  saveDeal() {
    let newDeal = {
      id: this.deal.id,
      title: this.dealForm.get('title').value,
      market: { id: this.deal.market.id },
      text: this.dealForm.get('description').value,
      startDate: Math.round(new Date(this.dealForm.get('startDate').value).getTime()),
      endDate: Math.round(new Date(this.dealForm.get('endDate').value).getTime()),
      price: this.dealForm.get('price').value,
      image: this.deal.image64
    }
    this.dealService.update(newDeal).then( deal => {
      let updateTags: Tag[] = [];
      updateTags = this.extraTags(deal.tags, this.tags).concat(
        this.extraTags(this.tags, deal.tags)
      );
      
      updateTags.forEach(tag => {
        this.tagService.tagItem(Number(deal.id), tag);
      });
      this.router.navigate(['detail', 'deal', deal.id]);
    });
  }

  extraTags(list1: Tag[], list2: Tag[]) {
    // Find tags in e2 not in e1
    return list2.filter(t2 => {
      return !list1.some(t1 => {
        return t1.id == t2.id;
      })
    })
  }
}
