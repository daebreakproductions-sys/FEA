import { Injectable } from '@angular/core';
import { APIListOptions } from '@app/models/list-options';
import { Tag } from '@app/models/tag';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  public tags: Tag[];
  readonly pageSize: number = 100;
  public doneLoading: boolean = false;
  public notifier: Subject<Tag[]> = new Subject<Tag[]>();

  constructor(
    public api: ApiService,
  ) { 

  }

  init() {
    this.tags = [];
    let params: APIListOptions = {
      start: 0,
      length: this.pageSize,
      orderField: 'name',
      orderDir: 'ASC'
    };
    this.startPaging(params);
  }
  startPaging(params: APIListOptions) {
    this.api.getTags(params).then(tags => {
      this.tags = this.tags.concat(tags);
      this.notifier.next(tags);
      if(tags.length == this.pageSize) {
        let newParams = params;
        newParams.start += this.pageSize;
        this.startPaging(newParams);
      } else {
        this.doneLoading = true;
        this.notifier.complete();
      }
    });
  }
  search(searchTerm: string) {
    console.log(searchTerm);
    return this.tags.filter(tag => {
      return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }

}
