import { Injectable } from '@angular/core';
import { FeedQuery, FeedQueryPg } from '@app/models/feed-query';
import { Market } from '@app/models/market';
import { Tag } from '@app/models/tag';
import { UGC } from '@app/models/ugc';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';
import { PgUGC } from '@app/models/postgrest';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  public results: PgUGC[];
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
  async query() {
    this.loading = true;
    // let params: FeedQuery = {
    //   tags: this.tags.map(tag => tag.id).join(','),
    //   markets: this.markets.map(mkt => mkt.id).join(','),
    //   kind: this.types.join(','),
    //   page: this.page,
    //   length: this.length
    // };
    // if(this.q != null) {
    //   params.q = this.q;
    // }
    let params: FeedQueryPg = {
      select: 'id,entity(created,modified,entity_tag!left(tag(*)),comment!fkcwo1n0f96e30h6v7gvu587hrs(id,text)),\
usr!fkrulucpl3e6e7mfq71h03q49pb(id,firstname,lastname,username,image_path),\
tip(id,text,tiptype,image_path),\
deal(id,text,price,title,enddate,startdate,market(id,name),image_path),\
recipe(id,servings,title,description,published,image_path,recipestep(id,title,image_path,step_order,instructions,time_minutes)),\
review(id,text,entity!fk5syqvx6lhvcksh53pgjuf22bw(market(id,name)),reviewproperty(value)),\
reaction!fkloe4jk2wh5f5akqrwe9waen0t(user_id),\
ugc_tags',
      or: '(' + this.types.map((t) => t+'.not.is.null').join(',') + ')',
      order: 'entity(created).desc',
      limit: this.length,
      offset: this.page * this.length,
    }
    if(this.tags.length > 0) {
      params['ugc_tags'] = 'ov.{' + this.tags.map(tag => tag.id).join(',') + '}';
    }
    if(this.markets.length > 0) {
      params['deal.market_id'] = 'in.(' + this.markets.map(mkt => mkt.id).join(',') + ')';
      params['deal'] = 'not.is.null';
    }
    if(this.q != null) {
      if(this.types.includes('deal')) {
        params['deal.search_col'] = 'plfts.' + encodeURIComponent(this.q);
      }
      if(this.types.includes('tip')) {
        params['tip.search_col'] = 'plfts.' + encodeURIComponent(this.q);
      }
      if(this.types.includes('review')) {
        params['review.search_col'] = 'plfts.' + encodeURIComponent(this.q);
      }
      if(this.types.includes('recipe')) {
        params['recipe.search_col'] = 'plfts.' + encodeURIComponent(this.q);
      }
    }
    // Add our own Observable here so we can "cancel" an existing query to ignore the results
    // return new Promise<void>((resolve) => {
    //   this.api.queryFeed(params).then(ugcs => {
    //     this.endOfFeed = (ugcs.length != this.length);
    //     let formatted = ugcs.map(ugc => {
    //       return <UGC>HelperService.PopulateEntity(ugc);
    //     });
    //     this.results = this.results.concat(formatted);
    //     this.loading = false;
    //     resolve();
    //   });
    // });
    let ugcs = await this.api.queryFeedPg<PgUGC[]>(params);
    this.endOfFeed = (ugcs.length != this.length);
    this.results = this.results.concat(ugcs);
    this.loading = false;
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
