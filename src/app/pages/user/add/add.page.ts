import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class UserAddPage implements OnInit {

  public user= null;
  private id: number;
  private formData = {name:''};
  public loading = true;

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(){
    this.loading = false;
    this.user= {name: ''};
  }

  goBack() {
    this.router.navigate(['users']);
  }

  createUser(form) {
    this.loading = true;
    this.formData = form.form.value;
    return new Promise((resolve, reject) => {
      this.api.createUser(this.formData)
      .then((data: any) => {
        this.id = data.data.id;
        this.loading = false;
        this.router.navigate(['user/'+this.id]);
        resolve(data);
      }, err => {
        this.loading = false;
        reject(err);
      });
    });
  }
}
