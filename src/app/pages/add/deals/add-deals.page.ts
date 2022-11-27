import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Deal } from '@app/models/deal';
import { StartEndDatesValidator } from '@app/validators/start-end-dates';
import { IonSearchbar, IonSlides, ModalController } from '@ionic/angular';
import { MarketModalPage } from '../../modals/market-modal/market-modal.page'
import { debounceTime } from 'rxjs/operators';
import { Tag } from '@app/models/tag';
import * as keyword_extractor from 'keyword-extractor'
import { TagService } from '@app/services/tag.service';
import { DealService } from '@app/services/deal.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-deals',
  templateUrl: './add-deals.page.html',
  styleUrls: ['./add-deals.page.scss'],
})
export class AddDealsPage implements OnInit {
  @ViewChild(IonSlides) slider: IonSlides;
  public dealForm: FormGroup;
  public validation_messages;
  public clearPickerOptions: any;

  public deal: Deal;
  public tags: Tag[];
  public tagStrings: string[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  public nextButton = {
    text: 'Location',
    show: true,
    disabled: true
  }
  public prevButton = {
    text: 'Title',
    show: false,
    disabled: false
  }
  public showSaveButton: boolean = false;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public tagService: TagService,
    public dealService: DealService,
    public router: Router,
    public actionSheetController: ActionSheetController,
  ) { 
    this.dealForm = AddDealsPage.newDealForm();
    this.validation_messages = AddDealsPage.validation_messages;
    this.clearPickerOptions = AddDealsPage.clearPickerOptions(this.dealForm, 'endDate');
  }

  public static newDealForm() {
    return new FormGroup({
      title: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.required
      ])),
      description: new FormControl(''),
      startDate: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      endDate: new FormControl(''),
      price: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    }, (formGroup: FormGroup) => {
      return StartEndDatesValidator.checkDates(formGroup);
   });
  }
  public static clearPickerOptions(dealForm: FormGroup, control: string) {
    return {
      buttons: [
        {
          text: 'Clear',
          handler: () => dealForm.controls[control].setValue(null)
        },
        {
          text: 'Done',
          handler: (data) => {
            let dt = new Date();
            dt.setFullYear(data.year.value);
            dt.setMonth(data.month.value - 1);
            dt.setDate(data.day.value);
            dealForm.controls[control].setValue(dt);
          }
        }
      ]
    };
  }
  public static validation_messages = {
    'title': [
        { type: 'required', message: 'Title is required.' },
        { type: 'minlength', message: 'Title must be at least 3 characters long.' },
        { type: 'maxlength', message: 'Title cannot be more than 50 characters long.' },
      ],
      'description': [],
      'startDate': [
        { type: 'required', message: 'A Discovery Date is required.' },
      ],
      'endDate': [
        { type: 'required', message: 'An End date is required.' },
      ],
      'price': [
        { type: 'required', message: 'A Price is required.' },
      ],
      'dates': [
        { type: 'startLater', message: 'The End date cannot be earlier than the Discovery date' }
      ],
    };

  ngOnInit() {
    this.resetDeal();
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.dealForm.reset();
    this.resetDeal();
  }
  resetDeal() {
    this.deal = {
      market: null,
      startDate: null,
      endDate: null,
      image64: null,
      title: '',
      text: '',
      price: '',
      tags: [],
    }
  }
  ngAfterViewInit() {
    for(let control in this.dealForm.controls) {
      let form: AbstractControl = this.dealForm.controls[control];
      form.statusChanges
        .pipe(debounceTime(400))
        .subscribe(() => {
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
            this.updateSlideUI();
          }, 25);
        });
    }
    this.updateSlideUI();
  }

  updateHeight() {
    setTimeout(() => {
      this.slider.updateAutoHeight(225);
      this.updateSlideUI();
    }, 25);
  }
  updateSlideUI() {
    this.slider.getActiveIndex().then(slideNumber => {
      // Determine lock/unlock for slides
      // Title, Picture, Details, Location, Tags, Description
      let locked = false;
      switch(slideNumber) { 
        case 0:
          // Title
          locked = !this.checkStep1();
          this.nextButton.text = 'Picture';
          break;
        case 1:
          // Picture
          setTimeout(() => {
            this.slider.updateAutoHeight(175);
          }, 75);
          locked = !this.checkStep2();
          this.prevButton.text = 'Title';
          this.nextButton.text = 'Details';
          break;
        case 2:
          // Details
          locked = !this.checkStep3();
          this.prevButton.text = 'Picture';
          this.nextButton.text = 'Location';
          break;
        case 3:
          // Location
          locked = !this.checkStep4();
          this.prevButton.text = 'Details';
          this.nextButton.text = 'Tags';
          break;
        case 4:
          // Tags
          //this.loadTags();
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
          }, 25);
          locked = !this.checkStep5();
          this.prevButton.text = 'Location';
          this.nextButton.text = 'Description';
          break;
        case 5:
          // Description
          locked = !this.checkStep5();
          this.prevButton.text = 'Tags';
          break;
      }
      this.slider.lockSwipeToNext(locked);
      this.nextButton.disabled = locked;
      this.prevButtonVisible(slideNumber);
      this.nextButtonVisible(slideNumber);
      this.saveButtonVisible(slideNumber);
    });
  }

  async presentMarketModal() {
    const modal = await this.modalController.create({
      component: MarketModalPage,
      cssClass: 'my-custom-class'
    });
    modal.present();
    await modal.onWillDismiss().then(market => {
      this.deal.market = market.data;
      this.updateSlideUI();
      setTimeout(() => {
        this.nextClick();
      }, 500);
    });
  }

  updateTags(tags: Tag[]) {
    this.tags = tags;
    this.updateHeight();
  }
  getTagStrings(): string[] {
    return [this.dealForm.get('title').value, this.dealForm.get('description').value];
  }

  selectImage() {
    const options: ImageOptions = {
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }
    Camera.getPhoto(options).then((imageData) => {
      this.deal.image64 = imageData.base64String;
      this.updateSlideUI();
    }, (err) => {
      // Handle error
      console.log(err)
    });
  }  

  saveDeal = (): void => {
    let newDeal = {
      title: this.dealForm.get('title').value,
      market: { id: this.deal.market.id },
      text: this.dealForm.get('description').value,
      startDate: Math.round(new Date(this.dealForm.get('startDate').value).getTime()),
      endDate: Math.round(new Date(this.dealForm.get('endDate').value).getTime()),
      price: this.dealForm.get('price').value,
      image: this.deal.image64
    }
    this.dealService.create(newDeal).then( async deal => {
      if(this.tags) {
        for (let index = 0; index < this.tags.length; index++) {
          const tag = this.tags[index];
          await this.tagService.tagItem(Number(deal.id), tag);
        }
      }
      this.router.navigate(['tabs/me']);
    });
  }

  prevButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 0:
        this.prevButton.show = false;
        break;
      default:
        this.prevButton.show = true;
    }
  }
  nextButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 5:
        this.nextButton.show = false;
        break;
      default:
        this.nextButton.show = true;
    }
  }
  saveButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 5:
        this.showSaveButton = true;
        break;
      default:
        this.showSaveButton = false;
    }
  }

  nextClick() {
    if(!this.nextButton.disabled) {
      this.slider.slideNext();
    }
  }
  prevClick() {
    if(!this.prevButton.disabled) {
      this.slider.slidePrev();
    }
  }

  // Title, Picture, Details, Location, Tags, Description
  // These all return true if they are valid
  checkStep1(): boolean {
    // Title
    return this.dealForm.controls['title'].valid;// (this.deal.title != '') && (this.deal.title != null);
  }
  checkStep2(): boolean {
    // Picture
    return true;
  }
  checkStep3(): boolean {
    // Start/End Date and Price
    return (this.dealForm.controls['startDate'].valid &&
      this.dealForm.controls['endDate'].valid &&
      this.dealForm.controls['price'].valid);
  }
  checkStep4(): boolean {
    // Location
    return (this.deal.market != null);
  }
  checkStep5(): boolean {
    // Tags
    return true;
  }
  checkStep6(): boolean {
    // Description
    return true;
  }

}
