import { Component, OnInit } from '@angular/core';
import { AbridgedFoodItem, FDCService, FoodListCriteria } from '@app/lib/usda';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  foods: AbridgedFoodItem[] = new Array<AbridgedFoodItem>();

  constructor(
    public usda: FDCService
    ) { 
      // usda.configuration.apiKeys = {key: "T0CUqfUYUm7HhgRPz7Uuga8IbscMIQ8xaeVblGSC"};
    }

  ngOnInit() {
    const myObserver = {
      next: x => this.foods.push(x),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log(this.foods),
    };
    let criteria: FoodListCriteria = {};

    criteria.dataType = [ FoodListCriteria.DataTypeEnum.Foundation ];
    criteria.pageSize = 200;
    this.usda.postFoodsList(criteria)
    .subscribe(myObserver);
  }

}
