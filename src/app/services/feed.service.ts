import { Injectable } from '@angular/core';
import { FeedQuery } from '@app/models/feed-query';
import { Market } from '@app/models/market';
import { Tag } from '@app/models/tag';
import { UGC } from '@app/models/ugc';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  public results: UGC[];
  public endOfFeed: boolean;
  public loading: boolean = false;
  // Parameters
  private q: string;
  private tags: Tag[];
  private markets: Market[];
  private types: string[];
  private page: number = 0;
  private length: number = 10;

  constructor(
    public api: ApiService,
  ) { 
    this.reset();
    this.query();
  }

  reset() {
    this.results = [];
    this.q = null;
    this.tags = [];
    this.markets = [];
    this.types = ["deal", "tip", "recipe", "review"];
    this.endOfFeed = false;
  }

  freshQuery() {
    this.page = 0;
    this.results = [];
    this.endOfFeed = false;
    return this.query();
  }
  query() {
    this.loading = true;
    let params: FeedQuery = {
      tags: this.tags.map(tag => tag.id).join(','),
      markets: this.markets.map(mkt => mkt.id).join(','),
      kind: this.types.join(','),
      page: this.page,
      length: this.length
    };
    if(this.q != null) {
      params.q = this.q;
    }
    return new Promise<void>((resolve) => {
      this.api.queryFeed(params).then(ugcs => {
        this.endOfFeed = (ugcs.length != this.length);
        let formatted = ugcs.map(ugc => {
          return <UGC>HelperService.PopulateEntity(ugc);
        });
        this.results = this.results.concat(formatted);
        this.loading = false;
        resolve();
      });
    });
  }

  nextPage() {
    this.page = this.page + 1;
    return this.query();
  }

  setTags(tags: Tag[], refresh: boolean = true) {
    this.tags = tags;
    if(refresh)
      this.freshQuery();
  }
  getTags() {
    return this.tags;
  }
  removeTag(id: number) {
    this.tags = this.tags.filter(tag => tag.id != id);
    this.freshQuery();
  }
  loadByTag(tag: Tag) {
    this.reset();
    this.tags = [tag];
    this.freshQuery();
  }

  setMarkets(markets: Market[], refresh: boolean = true) {
    this.markets = markets;
    if(refresh)
      this.freshQuery();
  }
  getMarkets() {
    return this.markets;
  }
  removeMarket(id: number) {
    this.markets = this.markets.filter(mkt => mkt.id != id);
    this.freshQuery();
  }
  loadByMarket(market: Market, types: string[]) {
    this.reset();
    this.types = types;
    this.markets = [market];
    this.freshQuery();
  }

  setTypes(types: string[]) {
    this.types = types.map(t => t.toLowerCase());
    this.freshQuery();
  }
  getTypes() {
    return this.types;
  }
  toggleType(type: string) {
    if(this.typeEnabled(type)) {
      // Already in list, remove
      this.clearType(type);
    } else {
      // Not yet in list, add
      this.setType(type);
    }
    this.freshQuery();
  }
  typeEnabled(test: string): boolean {
    return this.types.some(which => which.toLowerCase() == test.toLowerCase());
  }
  setType(type: string) {
    if(!this.typeEnabled(type)) {
      this.types.push(type.toLowerCase());
    }
  }
  clearType(type: string) {
    this.types = this.types.filter(t => t != type);
  }

  setSearchTerm(term: string) {
    this.q = term;
    return this.freshQuery();
  }
  getSearchTerm() {
    return this.q;
  }
  clearSearchTerm() {
    this.q = null;
    this.freshQuery();
  }
}
