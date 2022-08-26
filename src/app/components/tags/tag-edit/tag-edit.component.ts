import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '@app/models/tag';
import { TagModalPage } from '@app/pages/modals/tag-modal/tag-modal.page';
import { TagService } from '@app/services/tag.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'eats-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss'],
})
export class TagEditComponent implements OnInit {
  @Output() tagsUpdatedEvent = new EventEmitter<Tag[]>();
  @Input() UGCId: number;
  public tags: Tag[];

  constructor(
    public modalController: ModalController,
    public tagService: TagService,
  ) { }

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.tagService.byEntityId(this.UGCId).then(tags => {
      this.tags = tags;
      this.sendUpdate(tags);
    });
  }

  sendUpdate(tags: Tag[]) {
    this.tagsUpdatedEvent.emit(tags);
  }

  async presentTagModal() {
    const modal = await this.modalController.create({
      component: TagModalPage,
      componentProps: {
        initialTags: this.tags,
      }
    });
    modal.present();
    await modal.onWillDismiss().then(tags => {
      //console.log(tags)
      if(tags.data != null) {
        this.tags = tags.data;
        this.sendUpdate(tags.data);
      }
    });
  }
}
