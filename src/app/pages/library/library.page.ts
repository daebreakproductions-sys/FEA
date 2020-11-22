import { Component, OnInit } from '@angular/core';
import { AbridgedFoodItem, FDCService, FoodListCriteria } from '@app/lib/usda';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  foods: AbridgedFoodItem[] = new Array<AbridgedFoodItem>();
  groupedFoods: { 
    [key: string]: [ 
      {
        shortDesc: string, 
        food: AbridgedFoodItem 
      }
    ]
  } = {};
  

  constructor(
    public usda: FDCService
    ) { }

  getSubDesc(food: AbridgedFoodItem) {
    return {
      shortDesc: food.description.substr(food.description.indexOf(',') + 1).trim(),
      food: food
    };
  }
  groupFoods() {
    this.foods.forEach(food => {
      let group: string = food.description.split(',')[0].trim().toLowerCase();
      if(!this.groupedFoods.hasOwnProperty(group)) {
        this.groupedFoods[group] = [this.getSubDesc(food)];
      } else {
        this.groupedFoods[group].push(this.getSubDesc(food));
      }
    });
    console.log(this.groupedFoods);
  }
  ngOnInit() {
    const myObserver = {
      next: x => {
        x.forEach(item => {
          this.foods.push(item);
        })
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => this.groupFoods(),
    };
    let criteria: FoodListCriteria = {};

    criteria.dataType = [ FoodListCriteria.DataTypeEnum.Foundation ];
    criteria.pageSize = 200;
    this.usda.postFoodsList(criteria)
    .subscribe(myObserver);
  }

}
