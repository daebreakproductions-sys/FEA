import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-followees',
  templateUrl: './followees.page.html',
  styleUrls: ['./followees.page.scss'],
})
export class FolloweesPage implements OnInit {
  user: User;
  followees: User[];

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
      this.api.getUserFollowees(id).then(users => {
        this.followees = users.sort((a, b) => {
          return a.id - b.id;
        });
      });
      console.log(this.user);
    } else {
      this.user = await this.api.getCurrentUser();
      this.api.getMyFollowees().then(users => {
        this.followees = users.sort((a, b) => {
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
