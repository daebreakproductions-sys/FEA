import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '@app/models/tag';
import { Tip } from '@app/models/tip';
import { TipType } from '@app/models/tip-type.enum';
import { AddTipsPage } from '@app/pages/add/tips/add-tips.page';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { HelperService } from '@app/services/helper-service.service';
import { TagService } from '@app/services/tag.service';
import { TipService } from '@app/services/tip.service';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { getAllEnumEntries } from 'enum-for'

@Component({
  selector: 'app-edit-tips',
  templateUrl: './edit-tips.page.html',
  styleUrls: ['./edit-tips.page.scss'],
})
export class EditTipsPage implements OnInit {
  public tipForm: FormGroup;
  public validation_messages;
  public tip: Tip;
  public tags: Tag[];
  public types: {val: number, show: string}[] = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public tipService: TipService,
    public modalController: ModalController,
    public tagService: TagService,
    public actionSheetController: ActionSheetController,
  ) { 
    getAllEnumEntries(TipType).forEach(type => {
      this.types.push({
        val: Number(type[1]),
        show: type[0]
      })
    });
  }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.tipService.byId(id).then(deal => {
      console.log(deal);
      this.loadFields(deal);
    });
    this.tipForm = AddTipsPage.newTipForm();
    this.validation_messages = AddTipsPage.validation_messages;
  }
  loadFields(tip: Tip) {
    this.tip = tip;
    this.tags = tip.tags;
  
    this.tipForm.get('type').setValue(tip.tipType);
    this.tipForm.get('description').setValue(tip.text);
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
      if(tags.data != null) {
        this.tags = tags.data;
      }
    });
  }
  selectImage() {
    const options: ImageOptions = {
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }
    Camera.getPhoto(options).then((imageData) => {
      this.tip.image64 = imageData.base64String;
    }, (err) => {
      // Handle error
      console.log(err)
    });
  }  

  saveTip() {
    let newTip = {
      id: this.tip.id,
      type: this.tipForm.get('type').value,
      text: this.tipForm.get('description').value,
      image: this.tip.image64,
      tags: this.tags.map(t => {
        return { id: t.id };
      })
    }
    this.tipService.update(newTip).then(tip => {
      this.router.navigate(['detail', 'tip', tip.id]);
    });
  }
}
