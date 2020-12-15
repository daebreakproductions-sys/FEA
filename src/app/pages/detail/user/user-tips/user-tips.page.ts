import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tip } from '@app/models/tip';
import { TipService } from '@app/services/tip.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user-tips',
  templateUrl: './user-tips.page.html',
  styleUrls: ['./user-tips.page.scss'],
})
export class UserTipsPage implements OnInit {
  public tips: Tip[];

  constructor(
    public route: ActivatedRoute,
    public tipService: TipService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.parent.parent.parent.params.id;
    console.log(this.route)
    this.userService.getUser(id).then(usr => {
      this.tipService.byUser(id).then(tips => {
        this.tips = tips.sort((a,b) => {
          return Number(a.created.epochSecond) - Number(b.created.epochSecond);
        }).map(tip => {
          tip.usr = usr;
          return tip;
        });
      });
    });
  }
}
