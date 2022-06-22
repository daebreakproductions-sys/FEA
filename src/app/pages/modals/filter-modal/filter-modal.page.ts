import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Market } from '@app/models/market';
import { Tag } from '@app/models/tag';
import { MarketService } from '@app/services/market.service';
import { TagService } from '@app/services/tag.service';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { FilterModalResult } from '@app/models/filter-modal-result';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {
  @Input("initialMarkets") initialMarkets: Market[] = [];
  public allMarkets: Market[];
  public marketSearchResults: Market[];
  public nearby: Market[];
  public associatedMarkets: {
    selected: boolean,
    market: Market
  }[];
  public searchMarkets: {
    selected: boolean,
    market: Market
  }[];
  public marketSearchTerm: string = '';

  @Input("initialTags") initialTags: Tag[] = [];
  @ViewChild('search') searchBar: IonSearchbar;
  public allTags: Tag[];
  public tagSearchResults: Tag[];
  public associatedTags: {
    selected: boolean,
    tag: Tag
  }[];
  public searchTags: {
    selected: boolean,
    tag: Tag
  }[];
  public tagSearchTerm: string = '';

  constructor(
    public viewCtrl: ModalController,
    public tagService: TagService,
    public marketService: MarketService,
  ) { }

  loadInitialTags() {
    this.allTags = this.tagService.tags;
    this.associatedTags = this.initialTags.map(tag => {
      return {
        tag: tag,
        selected: true
      }
    });
  }
  loadInitialMarkets() {
    this.allMarkets = this.marketService.markets;
    this.associatedMarkets = this.initialMarkets.map(mkt => {
      return {
        market: mkt,
        selected: true
      }
    });
  
    Geolocation.getCurrentPosition().then(data => {
      this.nearby = this.marketService.getNearby(data, 5).map(result => {
        return result.market;
      });
    });
  }
  ngOnInit() {
    const tagObserver = {
      next: x => { },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => this.loadInitialTags(),
    };
    const marketObserver = {
      next: x => { },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => this.loadInitialMarkets(),
    };

    if(this.tagService.doneLoading) {
      this.loadInitialTags();
    } else {
      this.tagService.notifier.subscribe(tagObserver);
    }

    if(this.marketService.doneLoading) {
      this.loadInitialMarkets();
    } else {
      this.marketService.notifier.subscribe(marketObserver);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  save() {
    let results: FilterModalResult = {
      tags: this.associatedTags
        .filter(tag => {
          return tag.selected;
        })
        .map(tag => {
          return tag.tag;
        }),
      markets: this.associatedMarkets
        .filter(mkt => {
          return mkt.selected;
        })
        .map(mkt => {
          return mkt.market;
        })
    };

    this.viewCtrl.dismiss(results);
  }

  //#region Tags
  toggleTag(id: number) {
    this.associatedTags.forEach(entry => {
      if(Number(entry.tag.id) == id) {
        entry.selected = !entry.selected;
      }
    })
  }
  searchTag(searchEvent: any) {
    if(searchEvent.target.value) {
      this.tagSearchTerm = searchEvent.target.value;
      this.searchTags = this.tagService.search(searchEvent.target.value).map( (val: Tag) => {
        return { selected: false, tag: val };
      });
    } else {
      this.tagSearchTerm = null;
      this.searchTags = null;
    }
  }
  chooseSearchTag(id: number) {
    let tagIndex: number = this.searchTags.findIndex(which => which.tag.id == id);
    let tag: Tag = this.searchTags.slice(tagIndex, tagIndex + 1)[0].tag;
    this.associatedTags.unshift({selected: true, tag: tag});
    this.eliminateDuplicateTags();
  }
  eliminateDuplicateTags() {
    let temp: { selected: boolean, tag: Tag }[] = [];
    this.associatedTags.forEach(item => {
      if(!temp.some(test => {
        return test.tag.id == item.tag.id;
      })) {
        temp.push(item);
      }
    });
    this.associatedTags = temp;
  }
  newTag(term: string) {
    this.tagService.create(term).then((tag) => {
      this.associatedTags.push({
        selected: true,
        tag: tag
      });
    });
  }
  //#endregion

  //#region Markets
  toggleMarket(id: number) {
    this.associatedMarkets.forEach(entry => {
      if(Number(entry.market.id) == id) {
        entry.selected = !entry.selected;
      }
    })
  }
  searchMarket(searchTerm: any) {
    if(searchTerm.target.value) {
      this.marketSearchTerm = searchTerm.target.value;
      this.searchMarkets = this.marketService.search(searchTerm.target.value).map( (val: Market) => {
        return { selected: false, market: val };
      });
    } else {
      this.marketSearchTerm = null;
      this.searchMarkets = null;
    }
  }
  chooseSearchMarket(id: number) {
    let mktIndex: number = this.searchMarkets.findIndex(which => which.market.id == id);
    let mkt: Market = this.searchMarkets.slice(mktIndex, mktIndex + 1)[0].market;
    this.associatedMarkets.unshift({selected: true, market: mkt});
    this.eliminateDuplicateMarkets();
  }
  chooseNearbyMarket(id: number) {
    let mkt: Market = this.nearby.find(which => which.id == id);
    this.associatedMarkets.unshift({selected: true, market: mkt});
    this.eliminateDuplicateMarkets();
  }
  eliminateDuplicateMarkets() {
    let temp: { selected: boolean, market: Market }[] = [];
    this.associatedMarkets.forEach(item => {
      if(!temp.some(test => {
        return test.market.id == item.market.id;
      })) {
        temp.push(item);
      }
    });
    this.associatedMarkets = temp;
  }
  //#endregion
}
