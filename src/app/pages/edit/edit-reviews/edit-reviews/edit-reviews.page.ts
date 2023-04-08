import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Review } from '@app/models/review';
import { ReviewPropertyType } from '@app/models/review-property-type.enum';
import { Tag } from '@app/models/tag';
import { AddReviewsPage } from '@app/pages/add/reviews/add-reviews.page';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { ReviewService } from '@app/services/review.service';
import { TagService } from '@app/services/tag.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { getAllEnumEntries } from 'enum-for';

@Component({
  selector: 'app-edit-reviews',
  templateUrl: './edit-reviews.page.html',
  styleUrls: ['./edit-reviews.page.scss'],
})
export class EditReviewsPage implements OnInit {
  public reviewForm: UntypedFormGroup;
  public validation_messages;

  public review: Review;
  public tags: Tag[];

  public locationTouched: boolean = false;
  public rawProperties = {selection: null, cleanliness: null, friendliness: null, accessibility: null, safety: null};

  public ReviewService = ReviewService;
  public ReviewPropertyType = ReviewPropertyType;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public reviewService: ReviewService,
    public modalController: ModalController,
    public tagService: TagService,
    public actionSheetController: ActionSheetController,
    public locationStrategy: LocationStrategy,
  ) {
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.reviewForm = AddReviewsPage.newReviewForm();
      this.validation_messages = AddReviewsPage.validation_messages;
      this.reviewService.byId(id).then(review => {
        this.loadFields(review);
      });
    });
  }

  ngOnInit() {
  }

  loadFields(review: Review) {
    this.review = review;
  
    console.log(this.rawProperties)
    this.reviewForm.get('text').setValue(review.text);
    this.review.properties.forEach((p) => {
      let t = getAllEnumEntries(ReviewPropertyType).filter(rp => rp[0] == <unknown>p.propertyType)[0][1];
      this.updateRating(p.propertyType.toString().toLowerCase(), p.value);
    });
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
      this.review.target = market.data;
      this.locationTouched = true;
    });
  }

  updateRating(rating: string, val: number) {
    if(val) {
      this.rawProperties[rating.toLowerCase()] = val;
    } else {
      this.rawProperties[rating.toLowerCase()] = null;
    }
  }

  saveReview = (): void => {
    // Update Review
    let newReview = {
      id: this.review.id,
      text: this.reviewForm.get('text').value,
      targetId: this.review.target.id,
      properties: Object.entries(this.rawProperties).map(( [k, v] ) => {
        return {propertyType: k.toUpperCase(), value: v}}),
      tags: this.tags?.map(t => {
        return {id: t.id};
      })
    }
    this.reviewService.update(newReview).then( review => {
      this.locationStrategy.back();
    });
  }
}
