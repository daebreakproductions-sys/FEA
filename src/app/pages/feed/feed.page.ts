import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSearchbar, ModalController } from '@ionic/angular';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { FeedService } from '@app/services/feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) searchBar: IonSearchbar;
  public searchTerm: string;
  public tipSelected: boolean = true;
  public dealSelected: boolean = true;

  constructor(
    public feedService: FeedService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    if(this.feedService.results == []) {
      this.feedService.query();
    }
  }
  ionViewWillEnter() {
    this.searchBar.value = this.feedService.getSearchTerm();
    this.infiniteScroll.disabled = this.feedService.endOfFeed;
  }
  search(searchTerm: any) {
    if(searchTerm) {
      this.feedService.setSearchTerm(searchTerm);
    } else {
      this.feedService.clearSearchTerm();
    }
  }
  async presentMarketModal() {
    const modal = await this.modalController.create({
      component: MarketModalPage
    });
    modal.present();
    await modal.onWillDismiss().then(markets => {
      if(markets.data != null) {
        this.feedService.clearType('tip');
        this.feedService.setMarkets(markets.data);
      }
    });
  }
  async presentTagModal() {
    const modal = await this.modalController.create({
      component: TagModalPage,
      componentProps: {
        initialTags: this.feedService.getTags(),
      }
    });
    modal.present();
    await modal.onWillDismiss().then(tags => {
      if(tags.data != null) {
        this.feedService.setTags(tags.data);
      }
    });
  }
  removeTag(id: number) {
    this.feedService.removeTag(id);
  }
  removeMarket(id: number) {
    this.feedService.removeMarket(id);
  }
  refreshFeed(event: any) {
    this.feedService.freshQuery().then(() => {
      this.infiniteScroll.disabled = false;
      event.target.complete();
    });
  }
  nextPage(event: any) {
    this.feedService.nextPage().then(() => {
      event.target.complete();
      this.infiniteScroll.disabled = this.feedService.endOfFeed;
    });
  }
  getLoadingText() {
    return 'Loading more ' + this.feedService.getTypes()
    .map(t => 
      t.split(' ')
       .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase() + 's')
       .join(' ')
    ).join('/')
    + '...';
  }
}
