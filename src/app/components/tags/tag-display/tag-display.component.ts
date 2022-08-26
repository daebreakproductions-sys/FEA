import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '@app/models/tag';
import { FeedService } from '@app/services/feed.service';
import { TagService } from '@app/services/tag.service';

@Component({
  selector: 'eats-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.scss'],
})
export class TagDisplayComponent implements OnInit {
  @Input() UGCId: number;
  public tags: Tag[];

  constructor(
    public tagService: TagService,
    public feedService: FeedService,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.loadTags();
    });
  }

  loadTags() {
    this.tagService.byEntityId(this.UGCId).then(tags => {
      this.tags = tags;
    });
  }
  navigateToTag(id: number) {
    this.feedService.loadByTag(this.tags.find(t => t.id == id));
    this.router.navigate(['tabs', 'feed']);
  }
}
