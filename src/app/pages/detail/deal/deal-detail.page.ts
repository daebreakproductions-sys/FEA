import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deal } from '@app/models/deal';
import { Tag } from '@app/models/tag';
import { Comment } from '@app/models/comment';
import { CommentService } from '@app/services/comment.service';
import { DealService } from '@app/services/deal.service';
import { TagService } from '@app/services/tag.service';
import { UserService } from '@app/services/user.service';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-deal',
  templateUrl: './deal-detail.page.html',
  styleUrls: ['./deal-detail.page.scss'],
})
export class DealDetailPage implements OnInit {
  public deal: Deal;
  public tags: Tag[];
  public comments: Comment[];
  public commentField: string = "";

  constructor(
    public route: ActivatedRoute,
    public dealService: DealService,
    public userService: UserService,
    public router: Router,
    public tagService: TagService,
    public commentService: CommentService,
    public apiService: ApiService,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.dealService.byId(id).then(deal => {
      console.log(deal);
      this.deal = deal;
      this.loadTags();
      this.loadComments();
    })
  }

  likeAction() {
    if(this.deal.iLike) {
      this.deal.reactionCount -= 1;
      this.deal.iLike = false;
    } else {
      // API Action
      this.deal.reactionCount += 1;
      this.deal.iLike = true;
    }
    this.apiService.toggleLike(this.deal.id);
  }
  loadTags() {
    this.tagService.byEntityId(this.deal.id).then(tags => {
      this.tags = tags;
    });
  }
  loadComments() {
    this.commentService.byEntityId(this.deal.id).then(comments => {
      this.comments = comments;
    });
  }
  marketDetail() {
    this.router.navigate(['detail', 'market', this.deal.market.id]);
  }
  addComment() {
    if(this.commentField.trim() != "") {
      this.commentService.create(this.deal.id, this.commentField).then(() => {
        this.loadComments();
        this.commentField = "";
      });
    }
  }
  userDetail() {
    this.router.navigate(['detail', 'user', this.deal.usr.id]);
  }
}
