import { Component, OnInit } from '@angular/core';
import { Tip } from '@app/models/tip';
import { TipService } from '@app/services/tip.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit {
  public tips: Tip[];

  constructor(
    public tipService: TipService,
  ) { 
    this.tips = [];
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.tipService.myTips().then(mine => {
      this.tipService.myFaveTips().then(faves => {
        this.tips = mine.concat(faves).sort((a,b) => {
          return Number(b.created.epochSecond - a.created.epochSecond); // Sort by date descending
        });
      });
    });
  }
}
