import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-__lc_template__-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class __template__AddPage implements OnInit {

  public __lc_template__= null;
  private id: number;
  private formData = {name:''};
  public loading = true;

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(){
    this.loading = false;
    this.__lc_template__= {name: ''};
  }

  goBack() {
    this.router.navigate(['__lc_template__s']);
  }

  create__template__(form) {
    this.loading = true;
    this.formData = form.form.value;
    return new Promise((resolve, reject) => {
      this.api.create__template__(this.formData)
      .then((data: any) => {
        this.id = data.data.id;
        this.loading = false;
        this.router.navigate(['__lc_template__/'+this.id]);
        resolve(data);
      }, err => {
        this.loading = false;
        reject(err);
      });
    });
  }
}
