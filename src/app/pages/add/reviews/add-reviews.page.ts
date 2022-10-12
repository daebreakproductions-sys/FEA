import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Review } from '@app/models/review';
import { ReviewProperty } from '@app/models/review-property';
import { ReviewPropertyType } from '@app/models/review-property-type.enum';
import { Tag } from '@app/models/tag';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { ReviewService } from '@app/services/review.service';
import { TagService } from '@app/services/tag.service';
import { ActionSheetController, IonSlides, ModalController } from '@ionic/angular';
import { getAllEnumEntries } from 'enum-for';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reviews',
  templateUrl: './add-reviews.page.html',
  styleUrls: ['./add-reviews.page.scss'],
})
export class AddReviewsPage implements OnInit {
  @ViewChild(IonSlides) slider: IonSlides;
  public reviewForm: FormGroup;
  public validation_messages;

  public review: Review;
  public tags: Tag[];
  public tagStrings: string[] = [];
  rawProperties = getAllEnumEntries(ReviewPropertyType).map(val => {
    return {propertyType: val[1], value: null}
  });

  public ReviewService = ReviewService;
  public ReviewPropertyType = ReviewPropertyType;

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
    public reviewService: ReviewService,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public tagService: TagService,
  ) { 
    this.reviewForm = AddReviewsPage.newReviewForm();
    this.validation_messages = AddReviewsPage.validation_messages;
  }

  ngOnInit() {
    this.resetReview();
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.reviewForm.reset();
    this.resetReview();
  }
  resetReview() {
    this.review = {
      target: null,
      text: '',
      tags: [],
      properties: []
    }
  }
  ngAfterViewInit() {
    for(let control in this.reviewForm.controls) {
      let form: AbstractControl = this.reviewForm.controls[control];
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

  async presentMarketModal() {
    const modal = await this.modalController.create({
      component: MarketModalPage,
      cssClass: 'my-custom-class'
    });
    modal.present();
    await modal.onWillDismiss().then(market => {
      this.review.target = market.data;
      this.updateSlideUI();
      setTimeout(() => {
        this.nextClick();
      }, 500);
    });
  }

  public static newReviewForm() {
    return new FormGroup({
      text: new FormControl('', Validators.compose([
        Validators.maxLength(255),
        Validators.minLength(3),
        Validators.required
      ])),
    });
  }
  public static validation_messages = {
    'text': [
      { type: 'required', message: 'Title is required.' },
      { type: 'minlength', message: 'Title must be at least 3 characters long.' },
      { type: 'maxlength', message: 'Title cannot be more than 255 characters long.' },
    ]
  };
  updateTags(tags: Tag[]) {
    this.tags = tags;
    this.updateHeight();
  }
  getTagStrings(): string[] {
    return [this.reviewForm.get('text').value];
  }
  updateRating(rating: ReviewPropertyType, val: number) {
    if(val) {
      this.rawProperties.find(x => x.propertyType == rating).value = val;
    } else {
      this.rawProperties.find(x => x.propertyType == rating).value = null;
    }
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
      // Target, Description, SELECTION/CLEANLINESS/FRIENDLINESS, ACCESSIBILITY/SAFETY, Tags

      let locked = false;
      switch(slideNumber) { 
        case 0:
          // Target
          locked = !this.checkStep1();
          this.nextButton.text = 'Description';
          break;
        case 1:
          // Description
          setTimeout(() => {
            this.slider.updateAutoHeight(175);
          }, 75);
          locked = !this.checkStep2();
          this.prevButton.text = 'Reviewee';
          this.nextButton.text = 'Details';
          break;
        case 2:
          // Details
          locked = !this.checkStep3();
          this.prevButton.text = 'Description';
          this.nextButton.text = 'Tags';
          break;
        case 3:
          // Tags
          setTimeout(() => {
            this.slider.updateAutoHeight(175);
          }, 75);
          locked = !this.checkStep4();
          this.prevButton.text = 'Details';
          break;
      }
      this.slider.lockSwipeToNext(locked);
      this.nextButton.disabled = locked;
      this.prevButtonVisible(slideNumber);
      this.nextButtonVisible(slideNumber);
      this.saveButtonVisible(slideNumber);
    });
  }

  saveReview = (): void => {
    // Update Recipe Base
    let newReview = {
      text: this.reviewForm.get('text').value,
      targetId: this.review.target.id,
      properties: this.rawProperties.filter(rp => {
        return rp.value != null;
      })
      .map(rp => {
        return {
          propertyType: getAllEnumEntries(ReviewPropertyType)[rp.propertyType][0],
          value: rp.value
        };
      }),
    }
    this.reviewService.create(newReview).then( async review => {
      if(this.tags) {
        for (let index = 0; index < this.tags.length; index++) {
          const tag = this.tags[index];
          await this.tagService.tagItem(Number(review.id), tag);
        }
      }
      this.router.navigate(['tabs', 'me', 'reviews']);
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
      case 3:
        this.nextButton.show = false;
        break;
      default:
        this.nextButton.show = true;
    }
  }
  saveButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 3:
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

  // Target, Description, Details, Tags
  // These all return true if they are valid
  checkStep1(): boolean {
    // Title
    return this.review.target != null;
  }
  checkStep2(): boolean {
    // Description
    return this.reviewForm.controls['text'].valid;
  }
  checkStep3(): boolean {
    // Details
    return true;
  }
  checkStep4(): boolean {
    // Tags
    return true;
  }
}
