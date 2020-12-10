import { Injectable } from '@angular/core';
import { APIListOptions } from '@app/models/list-options';
import { Tag } from '@app/models/tag';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

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
    public auth: AuthService,
  ) { 

  }

  init() {
    this.tags = [];
    if(this.auth.isAuthenticated()) {
      let params: APIListOptions = {
        start: 0,
        length: this.pageSize,
        orderField: 'name',
        orderDir: 'ASC'
      };
      this.startPaging(params);
    }
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
    return this.tags.filter(tag => {
      return tag.name != null;
    }).filter(tag => {
      return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }
  byId(id: number) {
    return this.tags.filter(val => {
      return val.id == id;
    })[0];
  }
  byEntityId(id: number) {
    return this.api.getTagsByEntity(id);
  }
  async create(name: string) {

    let tag: Tag = {
      name: name.trim().toLowerCase()
    };
    return new Promise<Tag>((resolve) => {
      let exactMatch = this.tags.find(val => {
        return tag.name === name;
      })
      if(exactMatch) {
        resolve(exactMatch);
      } else {
        this.api.createTag(tag).then(id => {
          this.api.getTag(id).then(tag => {
            this.tags.push(tag);
            resolve(tag);
          })
        });
      }
    })
  }

  tagItem(id: number, tag: Tag) {
    this.api.addTag(tag, id);
  }

}
