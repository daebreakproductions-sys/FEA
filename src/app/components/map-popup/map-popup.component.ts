import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EatsLocation } from '@app/models/eats-location';
import { HelperService } from '@app/services/helper-service.service';

@Component({
  selector: 'eats-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss'],
})
export class MapPopupComponent implements OnInit {
  @Input() eatsLocation: EatsLocation;

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

  navigate() {
    this.router.navigate(['detail', HelperService.getClassType(this.eatsLocation).toLowerCase(), this.eatsLocation.id]);
  }

}
