import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Deal } from '@app/models/deal';
import { Market } from '@app/models/market';
import { StartEndDatesValidator } from '@app/validators/start-end-dates';
import { IonSearchbar, IonSlides, ModalController } from '@ionic/angular';
import { MarketModalPage } from '../../modals/market-modal/market-modal.page'
import { debounceTime, filter, map } from 'rxjs/operators';
import { Tag } from '@app/models/tag';
import * as keyword_extractor from 'keyword-extractor'
import { TagService } from '@app/services/tag.service';
import { HelperService } from '@app/services/helper-service.service';
import { DealService } from '@app/services/deal.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-deals',
  templateUrl: './add-deals.page.html',
  styleUrls: ['./add-deals.page.scss'],
})
export class AddDealsPage implements OnInit {
  @ViewChild(IonSlides) slider: IonSlides;
  @ViewChild('search') searchBar: IonSearchbar;
  public dealForm: FormGroup;
  public validation_messages;
  public clearPickerOptions: any;

  public deal: Deal;
  public associatedTags: {
    selected: boolean,
    tag: Tag
  }[];
  public searchTags: {
    selected: boolean,
    tag: Tag
  }[];
  public tagSearchTerm: string = '';
  public imageToUpload: File;
  public minDate: string;
  public maxDate: string;
  public now: string;

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
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
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
        { type: 'required', message: 'A Start Date is required.' },
      ],
      'endDate': [
        { type: 'required', message: 'An End date is required.' },
      ],
      'price': [
        { type: 'required', message: 'A Price is required.' },
      ],
      'dates': [
        { type: 'startLater', message: 'The End date cannot be earlier than the Start date' }
      ],
    };

  ngOnInit() {
    this.resetDeal();
    this.minDate = this._minDate();
    this.maxDate = this._maxDate();
    this.now = this._now();
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.dealForm.reset();
    this.resetDeal();
    this.associatedTags = null;
    this.searchTags = null;
    this.tagSearchTerm = null;
    this.searchBar.value = null;
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
          this.loadTags();
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

  readonly oneMonth: number = 1000 * 60 * 60 * 24 * 30;
  private _minDate() {
    let now = new Date();
    now.setTime(Date.now() - this.oneMonth);
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

  readonly extractorOpts = {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  };
  loadTags() {
    if(this.associatedTags == null) {
      this.associatedTags = [];
      let titleKeywords: string[] = keyword_extractor.extract(this.dealForm.controls['title'].value,this.extractorOpts);
      let descKeywords: string[] = keyword_extractor.extract(this.dealForm.controls['description'].value,this.extractorOpts);
      titleKeywords.forEach(keyword => {
        this.tagService.search(keyword).forEach(tag => {
          this.associatedTags.push({
            selected: false,
            tag: tag
          });
        });
      });
    }
  }
  toggleTag(id: number) {
    this.associatedTags.forEach(entry => {
      if(Number(entry.tag.id) == id) {
        entry.selected = !entry.selected;
      }
    })
  }
  searchTag(searchEvent: any) {
    if(searchEvent.target.value) {
      this.tagSearchTerm = searchEvent.target.value;
      this.searchTags = this.tagService.search(searchEvent.target.value).map( (val: Tag) => {
        return { selected: false, tag: val };
      });
    } else {
      this.tagSearchTerm = null;
      this.searchTags = null;
    }
    this.updateSlideUI();
  }
  chooseSearchTag(id: number) {
    let tagIndex: number = this.searchTags.findIndex(which => which.tag.id == id);
    let tag: Tag = this.searchTags.slice(tagIndex, tagIndex + 1)[0].tag;
    this.associatedTags.unshift({selected: true, tag: tag});
    this.eliminateDuplicateTags();
    this.updateSlideUI();
  }
  eliminateDuplicateTags() {
    let temp: { selected: boolean, tag: Tag }[] = [];
    this.associatedTags.forEach(item => {
      if(!temp.some(test => {
        return test.tag.id == item.tag.id;
      })) {
        temp.push(item);
      }
    });
    this.associatedTags = temp;
  }
  newTag(term: string) {
    this.tagService.create(term).then((tag) => {
      this.associatedTags.push({
        selected: true,
        tag: tag
      });
      this.updateSlideUI();
    });
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
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
      title: this.dealForm.get('title').value,
      market: { id: this.deal.market.id },
      text: this.dealForm.get('description').value,
      startDate: Math.round(new Date(this.dealForm.get('startDate').value).getTime()),
      endDate: Math.round(new Date(this.dealForm.get('endDate').value).getTime()),
      price: this.dealForm.get('price').value,
      image: this.deal.image64
    }
    this.dealService.create(newDeal).then( deal => {
      this.associatedTags.filter(tag => {
        return tag.selected;
      }).forEach(tag => {
        this.tagService.tagItem(Number(deal.id), tag.tag);
      });
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
