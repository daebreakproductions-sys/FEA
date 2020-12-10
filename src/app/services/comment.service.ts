import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Comment } from '@app/models/comment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    public api: ApiService,
  ) { }

  byId(id: number) {
    return this.api.getComment(id);
  }
  byEntityId(id: number) {
    return this.api.getCommentsByEntity(id);
  }
  async create(entityId: number, commentText: string) {

    let comment = {
      text: commentText,
      target: entityId
    };
    return new Promise<Comment>((resolve) => {
      this.api.createComment(comment).then(id => {
        this.api.getComment(id).then(newComment => {
          resolve(newComment);
        })
      });
    });
  }

}
