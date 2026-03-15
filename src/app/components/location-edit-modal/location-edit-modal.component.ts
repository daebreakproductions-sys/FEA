import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EatsLocation } from '@app/models/eats-location';

@Component({
  selector: 'app-location-edit-modal',
  templateUrl: './location-edit-modal.component.html',
  styleUrls: ['./location-edit-modal.component.scss']
})
export class LocationEditModalComponent implements OnInit {
  @Input() location: EatsLocation;
  @Input() isNew: boolean = false;
  
  editedLocation: EatsLocation;
  
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.editedLocation = { ...this.location };
  }

  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    this.modalController.dismiss({
      updated: true,
      location: this.editedLocation
    });
  }

  getProviderTypes(): string[] {
    return ['FarmersMarket', 'FoodRetailer', 'FoodPantry', 'MealSite', 'MobileMarket'];
  }

  addFoodCategory() {
    if (!this.editedLocation.food_categories_list) {
      this.editedLocation.food_categories_list = [];
    }
    this.editedLocation.food_categories_list.push('');
  }

  removeFoodCategory(index: number) {
    if (this.editedLocation.food_categories_list) {
      this.editedLocation.food_categories_list.splice(index, 1);
    }
  }

  updateFoodCategory(index: number, value: string) {
    if (this.editedLocation.food_categories_list) {
      this.editedLocation.food_categories_list[index] = value;
    }
  }
}