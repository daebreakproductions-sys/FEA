import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-__lc_template__s',
  templateUrl: 'listing.page.html',
  styleUrls: ['listing.page.scss']
})
export class __template__sPage implements OnInit {

  public __lc_template__s = null;

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(){ 
    this.get__template__s();
  }

  get__template__s() {
    return new Promise((resolve, reject) => {  
      this.api.get__template__s()
      .then((data: any) => {
        this.__lc_template__s = data.data;
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }
  
}
