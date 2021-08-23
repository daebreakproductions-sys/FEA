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
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

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
    private camera: Camera,
    public actionSheetController: ActionSheetController,
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
    this.dealForm.get('startDate').setValue((<EatsDate>deal.startDate).toDate().toISOString());
    if((<EatsDate>deal.endDate).epochSecond != BigInt(0)) {
      this.dealForm.get('endDate').setValue((<EatsDate>deal.endDate).toDate().toISOString());
    }
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
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      cameraDirection: 0 // 0: Back Camera, 1: Front Camera
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.deal.image64 = imageData;
    }, (err) => {
      // Handle error
    });
  }  
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
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

  extraTags(list1: Tag[], list2: Tag[]) {
    // Find tags in e2 not in e1
    return list2.filter(t2 => {
      return !list1.some(t1 => {
        return t1.id == t2.id;
      })
    })
  }
}
