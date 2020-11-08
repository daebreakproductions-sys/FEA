import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-__lc_template__',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss']
})
export class __template__Page implements OnInit {
  
  public id = null;
  public __lc_template__= null;
  public loading = true;
  public formData = {name:''};

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(){ 
    this.id = this.route.snapshot.paramMap.get('id');
    this.get__template__(this.id);
  }

  goBack() {
    this.router.navigate(['__lc_template__s']);
  }

  get__template__(id: number) {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.api.get__template__(id)
        .then((data: any) => {
          this.loading = false;
          this.__lc_template__= data.data;
          resolve(data);
        }, err => {
          this.loading = false;
          reject(err);
        });
    });
  }

  update__template__(form) {
    this.loading = true;
    this.formData = form.form.value;
    return new Promise((resolve, reject) => {
      this.api.update__template__(this.id, this.formData)
        .then((data: any) => {
          this.loading = false;
          this.router.navigate(['__lc_template__s']);
          resolve(data);
        }, err => {
          this.loading = false;
          reject(err);
        });
    });
  }

}
