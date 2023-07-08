import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'eats-privacy-policy',
  template: '<div #container></div>',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true
})
export class PrivacyPolicyComponent implements OnInit {
  @ViewChild('container') container: ElementRef;

  constructor(
    private api: ApiService,
  ) { 
    this.api.getPrivacyPolicy().then(val => {
      this.container.nativeElement.innerHTML = val;
    });
  }

  ngOnInit() {}

}
