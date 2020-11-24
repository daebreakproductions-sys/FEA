import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FDCService, FoodNutrient, FoundationFoodItem } from '@app/lib/usda';
import { LoadingController } from '@ionic/angular';
import { OverlayBaseController } from '@ionic/angular/util/overlay';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public food: FoundationFoodItem;
  public title: string;
  public displayNutrients: {
    name: string,
    value: string,
    unit: string
  }[];
  loading: HTMLIonLoadingElement

  constructor(
    public usda: FDCService,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    const myObserver = {
      next: x => {
        this.food = x;
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {
        this.title = this.food.description.split(',').map(value => { return value.trim()}).join(' / ');
        this.digestNutrients(this.food.foodNutrients);
        this.loading.dismiss(); 
        console.log(this.food)
      }
    };

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading food detail...',
      duration: 10000
    });
    this.loading.present()

    let id = this.route.snapshot.params.id;
    this.usda.getFood(id).subscribe(myObserver);

    // console.log(this.route)
    // if (this.route.snapshot.data['special']) {
    //   this.food = this.route.snapshot.data['special'];
    //   this.title = this.food.description.split(',').map(value => { return value.trim()}).join(' / ');
    //   console.log(this.food)
    //   this.digestNutrients(this.food.foodNutrients);
    // }
    // this.loadingController.dismiss();
  }

  digestNutrients(nutrients: FoodNutrient[]) {
    this.displayNutrients = nutrients.filter(nutrient => {
      return (nutrient.nutrient && nutrient.amount && nutrient.amount > 0)
    })
    .map(nutrient => {
      return {
        name: nutrient.nutrient.name,
        value: nutrient.amount.toString(),
        unit: nutrient.nutrient.unitName
      }
    }).sort(
      (a, b) => a.name > b.name ? 1 : -1
    );
  }

}
