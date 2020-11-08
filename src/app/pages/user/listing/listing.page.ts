import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: 'listing.page.html',
  styleUrls: ['listing.page.scss']
})
export class UsersPage implements OnInit {

  public users = null;

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(){ 
    this.getUsers();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getUsers() {
    //return new Promise((resolve, reject) => {  
    //  this.api.getUsers()
    //  .then((data: any) => {
    //    this.users = data.data;
    //    resolve(data);
    //  }, err => {
    //    reject(err);
    //  });
    //});
  }
  
}
