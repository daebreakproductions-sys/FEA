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
    this.tipService.byId(2937).then(tip => { //8115
      this.tips.push(tip);
    })
  }

}
