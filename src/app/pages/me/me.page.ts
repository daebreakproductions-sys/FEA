import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/user';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  tabPath: string;
  user: User;

  constructor(public router: Router,
    public api: ApiService) { }

  async ngOnInit() {
    this.tabPath = '/tabs/me/';
    this.user = await this.api.getCurrentUser();
  }

  clickTab(event: Event, tab: string) {
		event.stopImmediatePropagation();
		this.router.navigate([`${this.tabPath}${tab}`]);
	}
}
