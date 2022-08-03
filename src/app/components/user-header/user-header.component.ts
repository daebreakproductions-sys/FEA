import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'eats-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss'],
})
export class UserHeaderComponent implements OnInit {
  @Input() usr: User;
  @Input() title: String;

  constructor(
    public userService: UserService,
    public router: Router,
  ) { }

  ngOnInit() {}

  userDetail() {
    this.router.navigate(['detail', 'user', this.usr.id]);
  }
}
