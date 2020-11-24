import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FDCService, FoodNutrient, FoundationFoodItem } from '@app/lib/usda';
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

  constructor(
    public usda: FDCService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const myObserver = {
      next: x => {
        x.forEach(item => {
          this.food = item;
        })
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('API Call complete'),
    };

    if (this.route.snapshot.data['special']) {
      this.food = this.route.snapshot.data['special'];
      this.title = this.food.description.split(',').map(value => { return value.trim()}).join(' / ');
      console.log(this.food)
      this.digestNutrients(this.food.foodNutrients);
    }
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
