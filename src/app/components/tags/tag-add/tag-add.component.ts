import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tag } from '@app/models/tag';
import { TagService } from '@app/services/tag.service';
import { IonSearchbar } from '@ionic/angular';
import * as keyword_extractor from 'keyword-extractor'

@Component({
  selector: 'eats-tag-add',
  templateUrl: './tag-add.component.html',
  styleUrls: ['./tag-add.component.scss'],
})
export class TagAddComponent implements OnInit {
  private _tagStrings: string[];
  @Input() set tagStrings(value: string[]) {
    this._tagStrings = value;
    this.refreshInputs();
  }
  get tagStrings(): string[] {
    return this._tagStrings;
  }
  @Output() tagsUpdatedEvent = new EventEmitter<Tag[]>();
  @ViewChild('search') searchBar: IonSearchbar;

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
    public tagService: TagService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.associatedTags = null;
    this.searchTags = null;
    this.tagSearchTerm = null;
    this.searchBar.value = null;
    this.loadTags();
  }
  ngViewWillUpdate() {
    this.refreshInputs();
  }

  sendUpdate() {
    this.tagsUpdatedEvent.emit(
      this.associatedTags
      .filter(tag => {
        return tag.selected;
      })
      .map(associated => associated.tag)
    );
  }
  readonly extractorOpts = {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  };
  loadTags() {
    console.log("Loading Tags")
    if(this.associatedTags == null) {
      this.associatedTags = [];
      this.refreshInputs();
    }
  }
  refreshInputs() {
    this.tagStrings.map(inputString => {
      return keyword_extractor.extract(inputString, this.extractorOpts);
    })
    .flat()
    .forEach(value => {
      this.tagService.search(value).then(tags => {
        tags.forEach(tag => {
          if(!this.associatedTags.map(at => at.tag.id).includes(tag.id))
          {
            this.associatedTags.push({
              selected: false,
              tag: tag
            });
          }
        });
      })
    });    
  }
  toggleTag(id: number) {
    this.associatedTags.forEach(entry => {
      if(Number(entry.tag.id) == id) {
        entry.selected = !entry.selected;
      }
    });
    this.sendUpdate();
  }
  searchTag(searchEvent: any) {
    if(searchEvent.target.value) {
      this.tagSearchTerm = searchEvent.target.value.replaceAll(/[^a-zA-Z0-9]/g, "");
      this.tagService.search(this.tagSearchTerm).then(tags => {
        this.searchTags = tags.map( (val: Tag) => {
          return { selected: false, tag: val };
        });
        this.sendUpdate();
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
    this.sendUpdate();
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
      this.sendUpdate();
    });
  }
}
