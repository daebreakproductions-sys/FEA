import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  tabPath: string;
  user: User;

  constructor(
      public router: Router,
      public api: ApiService,
      public route: ActivatedRoute,
    ) { }

  async ngOnInit() {
    if(this.route.snapshot.params.id) {
      this.tabPath = '/detail/user/' + this.route.snapshot.params.id + '/';
      this.user = await this.api.getUser(this.route.snapshot.params.id);
    } else {
      this.tabPath = '/detail/user/';
      this.user = await this.api.getCurrentUser();
    }
    console.log(this.user);
  }

  clickTab(event: Event, tab: string) {
		event.stopImmediatePropagation();
		this.router.navigate([`${this.tabPath}${tab}`]);
	}
}
