import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbridgedFoodItem, FDCService, FoodListCriteria } from '@app/lib/usda';
import { Animation, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  foods: AbridgedFoodItem[] = new Array<AbridgedFoodItem>();
  groupedFoods: { 
    [key: string]: {
      list: [ 
        {
          shortDesc: string, 
          food: AbridgedFoodItem 
        }
      ],
      show: boolean
    }
  } = {};
  

  constructor(
    public usda: FDCService,
    public router: Router,
    private animationCtrl: AnimationController,
    ) { }

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

  getSubDesc(food: AbridgedFoodItem) {
    return {
      shortDesc: food.description.substr(food.description.indexOf(',') + 1).trim(),
      show: false,
      food: food
    };
  }
  groupFoods() {
    this.foods.forEach(food => {
      let group: string = food.description.split(',')[0].trim().toLowerCase();
      if(!this.groupedFoods.hasOwnProperty(group)) {
        this.groupedFoods[group] = {list: [this.getSubDesc(food)], show: false};
      } else {
        this.groupedFoods[group].list.push(this.getSubDesc(food));
      }
    });
    console.log(this.groupedFoods);
  }


  groupClicked(key: string) {
    this.groupedFoods[key].show = !this.groupedFoods[key].show;
    console.log(document.querySelector('#'+key+'Arrow'))
    const animation: Animation = this.animationCtrl.create()
    .addElement(document.querySelector('#'+key+'Arrow'))
    .fill('none')
    .duration(1000)
    .fromTo('rotate', 0, 180);
    animation.play();
  }
}
