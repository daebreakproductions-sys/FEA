import { Injectable } from '@angular/core';
import { APIListOptions } from '@app/models/list-options';
import { Tag } from '@app/models/tag';
import { UGC } from '@app/models/ugc';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { HelperService } from './helper-service.service';

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
    if(searchTerm == null || searchTerm == '') return [];
    return this.tags.filter(tag => {
      return tag.name != null;
    }).filter(tag => {
      return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  }
  byId(id: number) {
    return new Promise<Tag>((resolve) => {
      if(this.doneLoading) {
        resolve(this.tags.filter(val => {
          return val.id == id;
        })[0]);
      } else {
        this.notifier.subscribe({complete: () => {
          resolve(this.tags.filter(val => {
            return val.id == id;
          })[0]);
        }})
      }
    });
  }
  byEntityId(id: number) {
    return this.api.getTagsByEntity(id);
  }
  async create(name: string): Promise<Tag> {

    let tag: Tag = {
      name: name.trim().toLowerCase()
    };
    return new Promise<Tag>((resolve) => {
      let exactMatch = this.tags.find(val => {
        return val.name == name;
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
    return this.api.addTag(tag, id);
  }
  searchByTag(id: number) {
    return new Promise<UGC[]>((resolve) => {
      this.byId(id).then(tag => {
        this.api.searchFeedByName(tag.name.trim()).then(ugcs => {
          resolve(ugcs.map(ugc => {
            return HelperService.PopulateEntity(ugc);
          }));
        });
      })
    });
  }

  public static extraTags(list1: Tag[], list2: Tag[]) {
    // Find tags in e2 not in e1
    return list2.filter(t2 => {
      return !list1.some(t1 => {
        return t1.id == t2.id;
      })
    })
  }

}
