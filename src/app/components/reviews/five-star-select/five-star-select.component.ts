import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'eats-five-star-select',
  templateUrl: './five-star-select.component.html',
  styleUrls: ['./five-star-select.component.scss'],
})
export class FiveStarSelectComponent implements OnInit {
  @Input() initialValue: number = null;
  @Input() title: string;
  @Output() valueUpdatedEvent = new EventEmitter<number>();
  public value: number;

  constructor() { }

  ngOnInit() {
    this.value = this.initialValue;
  }

  subtractStar(sub: number): string {
    if(sub < 1) {
      return "star-outline";
    } else {
      return "star";
    }
  }

  setValue(set: number) {
    this.value = set;
    this.valueUpdatedEvent.emit(set);
  }
}
