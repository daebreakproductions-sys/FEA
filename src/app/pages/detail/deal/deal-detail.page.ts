import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { DealService } from '@app/services/deal.service';
import { UserService } from '@app/services/user.service';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-deal',
  templateUrl: './deal-detail.page.html',
  styleUrls: ['./deal-detail.page.scss'],
})
export class DealDetailPage implements OnInit {
  public deal: Deal;

  constructor(
    public route: ActivatedRoute,
    public dealService: DealService,
    public userService: UserService,
    public router: Router,
    public apiService: ApiService,
    private authService: AuthService,
  ) {
    route.params.subscribe(val => {
      let id = this.route.snapshot.params.id;
      this.dealService.byId(id).then(deal => {
        this.deal = deal;
      })
    });
  }

  ngOnInit() {

  }

  likeAction() {
    if(this.authService.isAuthenticated()) {
      if(this.deal.iLike) {
        this.deal.reactionCount -= 1;
        this.deal.iLike = false;
      } else {
        // API Action
        this.deal.reactionCount += 1;
        this.deal.iLike = true;
      }
      this.apiService.toggleLike(this.deal.id);
    } else {
      this.authService.launchLoginAlert(this.router.url);
    }
  }
  marketDetail() {
    this.router.navigate(['detail', 'market', this.deal.market.id]);
  }
  editDeal() {
    this.router.navigate(['edit', 'deal', this.deal.id]);
  }
}
