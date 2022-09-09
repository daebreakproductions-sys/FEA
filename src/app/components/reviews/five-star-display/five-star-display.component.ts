import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'eats-five-star-display',
  templateUrl: './five-star-display.component.html',
  styleUrls: ['./five-star-display.component.scss'],
})
export class FiveStarDisplayComponent implements OnInit {
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
