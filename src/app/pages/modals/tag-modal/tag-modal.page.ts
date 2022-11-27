import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Tag } from '@app/models/tag';
import { TagService } from '@app/services/tag.service';
import { IonSearchbar, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.page.html',
  styleUrls: ['./tag-modal.page.scss'],
})
export class TagModalPage implements OnInit {
  @Input("initialTags") initialTags: Tag[];
  @ViewChild('search') searchBar: IonSearchbar;
  public allTags: Tag[];
  public searchResults: Tag[];
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
  ) { 
    
  }

  ngOnInit() {
    const myObserver = {
      next: x => { },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => this.allTags = this.tagService.tags,
    };
    if(this.tagService.doneLoading) {
      this.allTags = this.tagService.tags;
      this.associatedTags = this.initialTags.map(tag => {
        return {
          tag: tag,
          selected: true
        }
      });
    } else {
      this.tagService.notifier.subscribe(myObserver);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  save() {
    this.viewCtrl.dismiss(this.associatedTags
      .filter(tag => {
        return tag.selected;
      })
      .map(tag => {
        return tag.tag;
    }));
  }

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
      this.tagService.search(searchEvent.target.value).then(tags => {
        this.searchTags = tags.map( (val: Tag) => {
          return { selected: false, tag: val };
        });
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
  search(searchTerm: any) {
    if(searchTerm.target.value) {
      this.tagService.search(searchTerm.target.value)
        .then(tags => {
          this.searchResults = tags;
        });
    } else {
      this.searchResults = null;
    }
  }
}
