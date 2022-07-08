import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodPantrySite } from '@app/models/foodpantrysite';
import { FoodPantrySiteService } from '@app/services/foodpantrysite.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-foodpantrysite',
  templateUrl: './foodpantrysite-detail.page.html',
  styleUrls: ['./foodpantrysite-detail.page.scss'],
})
export class FoodPantrySiteDetailPage implements OnInit {
  public foodPantrySite: FoodPantrySite;

  constructor(
    private route: ActivatedRoute,
    public foodPantrySiteService: FoodPantrySiteService,
    public platform: Platform,
  ) { 
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.foodPantrySite = this.foodPantrySiteService.byId(id);
    });

  }

  navigate() {
    var mapUrl = '?q=' + this.foodPantrySite.lat + ',' + this.foodPantrySite.lng;
    // Check if a mobile device exists, or is web browser
    // if ( typeof(device) !== 'undefined') {
    var mapUrlFullPath = (this.platform.is("ios")) ? "maps://" + mapUrl : "geo:" + mapUrl;
    // } else {
    // var mapUrlType = "geo:" + mapUrl;
    // }
    window.open(mapUrlFullPath, '_system');
  }

  ngOnInit() {
  }

}
