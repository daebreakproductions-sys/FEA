import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MarketModalPage } from '@app/pages/modals/market-modal/market-modal.page';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { FeedService } from '@app/services/feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  public searchTerm: string;
  public tipSelected: boolean = true;
  public dealSelected: boolean = true;

  constructor(
    public feedService: FeedService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  search(searchTerm: any) {
    if(searchTerm) {
      this.searchTerm = searchTerm;
    } else {
      this.searchTerm = null;
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
}
