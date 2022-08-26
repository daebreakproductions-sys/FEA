import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { EatsDate } from '@app/models/eats-date';
import { Tag } from '@app/models/tag';
import { AddDealsPage } from '@app/pages/add/deals/add-deals.page';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { DealService } from '@app/services/deal.service';
import { TagService } from '@app/services/tag.service';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';

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

  public locationTouched: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public dealService: DealService,
    public modalController: ModalController,
    public tagService: TagService,
    public actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.dealService.byId(id).then(deal => {
      this.loadFields(deal);
    });
    this.dealForm = AddDealsPage.newDealForm();
    this.validation_messages = AddDealsPage.validation_messages;
    this.clearPickerOptions = AddDealsPage.clearPickerOptions(this.dealForm, 'endDate');
  }

  loadFields(deal: Deal) {
    this.deal = deal;
  
    this.dealForm.get('title').setValue(deal.title);
    this.dealForm.get('description').setValue(deal.text);
    this.dealForm.get('startDate').setValue((<EatsDate>deal.startDate).toDate().toISOString());
    if((<EatsDate>deal.endDate).epochSecond != BigInt(0)) {
      this.dealForm.get('endDate').setValue((<EatsDate>deal.endDate).toDate().toISOString());
    }
    this.dealForm.get('price').setValue(deal.price);
  }
  updateTags(tags: Tag[]) {
    this.tags = tags;
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

  selectImage() {
    const options: ImageOptions = {
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }
    Camera.getPhoto(options).then((imageData) => {
      this.deal.image64 = imageData.base64String;
    }, (err) => {
      // Handle error
      console.log(err)
    });
  }  

  saveDeal() {
    let newDeal = {
      id: this.deal.id,
      title: this.dealForm.get('title').value,
      market: { id: this.deal.market.id },
      text: this.dealForm.get('description').value,
      startDate: Math.round(new Date(this.dealForm.get('startDate').value).getTime() / 1000),
      endDate: Math.round(new Date(this.dealForm.get('endDate').value).getTime() / 1000),
      price: this.dealForm.get('price').value,
      image: this.deal.image64,
      tags: this.tags.map(t => {
        return {id: t.id};
      })
    }
    this.dealService.update(newDeal).then( deal => {
      this.router.navigate(['detail', 'deal', deal.id]);
    });
  }
}
