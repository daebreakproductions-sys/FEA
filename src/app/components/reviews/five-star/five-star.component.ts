import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'eats-five-star',
  templateUrl: './five-star.component.html',
  styleUrls: ['./five-star.component.scss'],
})
export class FiveStarComponent implements OnInit {
  @Input() value: number = 0;
  @Input() reviewCount: number;

  constructor() { }

  ngOnInit() {}

  subtractStar(sub: number): string {
    if(sub < 0.5) {
      return "star-outline";
    } else if (sub >= 0.5 && sub < 1) {
      return "star-half";
    } else {
      return "star";
    }
  }

}
