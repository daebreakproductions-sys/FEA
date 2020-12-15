import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tag } from '@app/models/tag';
import { UGC } from '@app/models/ugc';
import { TagService } from '@app/services/tag.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-tag-content',
  templateUrl: './tag-content.page.html',
  styleUrls: ['./tag-content.page.scss'],
})
export class TagContentPage implements OnInit {
  public items: UGC[];
  public tag: Tag;

  constructor(
    public route: ActivatedRoute,
    public tagService: TagService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.tagService.searchByTag(id).then(ugcs => {
      this.items = ugcs.sort((a,b) => {
        return Number(a.created.epochSecond - b.created.epochSecond);
      });
      this.items.forEach(ugc => {
        this.userService.getUser(ugc.usr.id).then(user => {
          ugc.usr = user;
        })
      })
    });
    this.tagService.byId(id).then(tag => {
      this.tag = tag;
    });
  }

}
