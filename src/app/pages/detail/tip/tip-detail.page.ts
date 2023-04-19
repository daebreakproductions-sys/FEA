import { Component, OnInit } from '@angular/core';
import { Tip } from '@app/models/tip';
import { UserService } from '@app/services/user.service';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipService } from '@app/services/tip.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-tip-detail',
  templateUrl: './tip-detail.page.html',
  styleUrls: ['./tip-detail.page.scss'],
})
export class TipDetailPage implements OnInit {
  public tip: Tip;

  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
    public tipService: TipService,
    public router: Router,
    public apiService: ApiService,
    private authService: AuthService,
  ) {    
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.tipService.byId(id).then(tip => {
        this.tip = tip;
      })
    });
  }

  ngOnInit() {

  }

  likeAction() {
    if(this.authService.isAuthenticated()) {
      if(this.tip.iLike) {
        this.tip.reactionCount -= 1;
        this.tip.iLike = false;
      } else {
        // API Action
        this.tip.reactionCount += 1;
        this.tip.iLike = true;
      }
      this.apiService.toggleLike(this.tip.id);
    } else {
      this.authService.launchLoginAlert(this.router.url);
    }
  }
  editTip() {
    this.router.navigate(['edit', 'tip', this.tip.id]);
  }
}
