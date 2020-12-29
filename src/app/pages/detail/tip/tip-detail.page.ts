import { Component, OnInit } from '@angular/core';
import { Tag } from '@app/models/tag';
import { Tip } from '@app/models/tip';
import { Comment } from '@app/models/comment';
import { CommentService } from '@app/services/comment.service';
import { TagService } from '@app/services/tag.service';
import { UserService } from '@app/services/user.service';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipService } from '@app/services/tip.service';
import { FeedService } from '@app/services/feed.service';

@Component({
  selector: 'app-tip-detail',
  templateUrl: './tip-detail.page.html',
  styleUrls: ['./tip-detail.page.scss'],
})
export class TipDetailPage implements OnInit {
  public tip: Tip;
  public tags: Tag[];
  public comments: Comment[];
  public commentField: string = "";

  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
    public tipService: TipService,
    public router: Router,
    public tagService: TagService,
    public commentService: CommentService,
    public apiService: ApiService,
    public feedService: FeedService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.tipService.byId(id).then(tip => {
      console.log(tip);
      this.tip = tip;
      this.loadTags();
      this.loadComments();
    })
  }

  likeAction() {
    if(this.tip.iLike) {
      this.tip.reactionCount -= 1;
      this.tip.iLike = false;
    } else {
      // API Action
      this.tip.reactionCount += 1;
      this.tip.iLike = true;
    }
    this.apiService.toggleLike(this.tip.id);
  }
  loadTags() {
    this.tagService.byEntityId(this.tip.id).then(tags => {
      this.tags = tags;
    });
  }
  loadComments() {
    this.commentService.byEntityId(this.tip.id).then(comments => {
      this.comments = comments;
    });
  }
  addComment() {
    if(this.commentField.trim() != "") {
      this.commentService.create(this.tip.id, this.commentField).then(() => {
        this.loadComments();
        this.commentField = "";
      });
    }
  }
  userDetail() {
    this.router.navigate(['detail', 'user', this.tip.usr.id]);
  }
  navigateToTag(id: number) {
    this.feedService.loadByTag(this.tags.find(t => t.id == id));
    this.router.navigate(['tabs', 'feed']);
  }
}
