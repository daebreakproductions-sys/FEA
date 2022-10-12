import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eats-once-button',
  templateUrl: './once-button.component.html',
  styleUrls: ['./once-button.component.scss'],
})
export class OnceButtonComponent implements OnInit {
  @Input() buttonText: String;
  @Input() expand: String;
  @Input() disabled: boolean;
  @Input() show: boolean = true;
  @Input() click: () => void;

  public activated: boolean = false;

  constructor(
    public route: ActivatedRoute,
  ) { 
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.activated = false;
    });
  }

  localClick() {
    this.activated = true;
    this.click();
  }

}
