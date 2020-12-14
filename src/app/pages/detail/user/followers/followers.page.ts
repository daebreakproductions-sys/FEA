import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {
  user: User;
  followers: User[];

  constructor(
    public route: ActivatedRoute,
    public api: ApiService,
    public router: Router,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    let id = this.route.snapshot.params.id;
    if(id) {
      this.user = await this.api.getUser(id);
      this.api.getUserFollowers(id).then(users => {
        this.followers = users.sort((a, b) => {
          return a.id - b.id;
        });
      });
      console.log(this.user);
    } else {
      this.user = await this.api.getCurrentUser();
      this.api.getMyFollowers().then(users => {
        this.followers = users.sort((a, b) => {
          return a.id - b.id;
        });
      });
      console.log(this.user);
    }
  }

  navigateToUser(id: number) {
    this.router.navigate(['detail', 'user', id]);
  }
}
