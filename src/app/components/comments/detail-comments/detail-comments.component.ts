import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '@app/services/comment.service';
import { Comment } from '@app/models/comment'
import { HelperService } from '@app/services/helper-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'eats-detail-comments',
  templateUrl: './detail-comments.component.html',
  styleUrls: ['./detail-comments.component.scss'],
})
export class DetailCommentsComponent implements OnInit {
  @Input() UGCId: number;
  comments: Comment[];
  public commentField: string = "";

  constructor(
    public commentService: CommentService,
    public helperService: HelperService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.loadComments();
    })
  }

  loadComments() {
    this.commentService.byEntityId(this.UGCId).then(comments => {
      this.comments = comments.map(cmt => HelperService.PopulateComment(cmt));
    });
  }

  addComment() {
    if(this.authService.isAuthenticated()) {
      if(this.commentField.trim() != "") {
        this.commentService.create(this.UGCId, this.commentField).then(() => {
          this.loadComments();
          this.commentField = "";
        });
      }
    } else {
      this.authService.launchLoginAlert(this.router.url);
    }
  }
}
