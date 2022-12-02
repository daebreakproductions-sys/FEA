import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  tabPath: string;
  user: User;
  followers: User[];
  followees: User[];

  constructor(
      public router: Router,
      public api: ApiService,
      public route: ActivatedRoute,
      public userService: UserService,
    ) { }

  async ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.tabPath = `${this.router.routerState.snapshot.url
      .replace('/user-recipes', '')
      .replace('/user-tips', '')
      .replace('/user-deals', '')
      .replace('/user-reviews', '')}/`;
    if(id) {
      this.user = await this.api.getUser(id);
      this.api.getUserFollowers(id).then(users => {
        this.followers = users;
      });
      this.api.getUserFollowees(id).then(users => {
        this.followees = users;
      });
      console.log(this.user);
    } else {
      this.user = await this.api.getCurrentUser();
      this.api.getMyFollowers().then(users => {
        this.followers = users;
      });
      this.api.getMyFollowees().then(users => {
        this.followees = users;
      });
      console.log(this.user);
    }
  }

  clickTab(event: Event, tab: string) {
		event.stopImmediatePropagation();
		this.router.navigate([this.tabPath, tab]);
  }
  showFollowers() {
    this.router.navigate([`${this.tabPath}../followers`]);
  }
  showFollowees() {
    this.router.navigate([`${this.tabPath}../followees`]);
  }
}
