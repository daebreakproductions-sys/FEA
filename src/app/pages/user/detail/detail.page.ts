import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss']
})
export class UserPage implements OnInit {
  
  public id = null;
  public user= null;
  public loading = true;
  public formData = {name:''};

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(){ 
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUser(this.id);
  }

  goBack() {
    this.router.navigate(['users']);
  }

  getUser(id: number) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.api.getUser(id)
        .then((data: any) => {
          this.loading = false;
          this.user= data.data;
          resolve(data);
        }, err => {
          this.loading = false;
          reject(err);
        });
    });
  }

  updateUser(form) {
    this.loading = true;
    this.formData = form.form.value;
    return new Promise((resolve, reject) => {
      this.api.updateUser(this.id, this.formData)
        .then((data: any) => {
          this.loading = false;
          this.router.navigate(['users']);
          resolve(data);
        }, err => {
          this.loading = false;
          reject(err);
        });
    });
  }

}
