import { Injectable } from '@angular/core';
import { Entity } from '@app/models/entity';
import { Market } from '@app/models/market';
import { Recipe } from '@app/models/recipe';
import { Review } from '@app/models/review';
import { ApiService } from './api.service';
import { HelperService } from './helper-service.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    public api: ApiService,
    public userService: UserService,
  ) { }

  byId(id: number) {
    return new Promise<Review>((resolve) => {
      this.api.getReview(id).then(review => {
        resolve(HelperService.PopulateReview(review));
      });
    });
  }

  async create(recipe: any) {
    return new Promise<Review>((resolve) => {
      this.api.createReview(recipe).then(id => {
        this.api.getReview(id).then(newReview => {
          resolve(HelperService.PopulateReview(newReview));
        })
      });
    })
  }  
  async update(recipe: any) {
    return new Promise<Review>((resolve) => {
      this.api.updateReview(recipe).then(id => {
        this.api.getReview(id).then(newReview => {
          resolve(HelperService.PopulateReview(newReview));
        })
      });
    })
  }
  async byUser(id: number, page: number = 0, pageLength: number = 10) {
    return new Promise<Review[]>((resolve) => {
      this.api.getUserContent(id, page, pageLength).then(ugcs => {
        let reviews: Review[];
        reviews = ugcs.filter(ugc => {
          return ugc.class.endsWith('Review');
        })
        .map(ugc => {
          return <Review>HelperService.PopulateEntity(ugc);
        });
        resolve(reviews);
      });
    });
  }

  myReviews() {
    return new Promise<Review[]>((resolve) => {
      this.userService.getMyContent("Review").then(reviews => {
        resolve(reviews.map(ugc => {
          return <Review>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }
  myFaveReviews() {
    return new Promise<Review[]>((resolve) => {
      this.userService.getMyFaves("Review").then(reviews => {
        resolve(reviews.map(ugc => {
          return <Review>HelperService.PopulateEntity(ugc);
        }));
      });
    });
  }

  public static getDisplayName(target: Entity): string {
    let type = HelperService.getClassType(target);
    if(type == "Market") {
      return (<Market>target).name;
    } else if (type == "Recipe") {
      return (<Recipe>target).title;
    } else {
      return "";
    }
  }
  public static getDisplayIcon(target: Entity): string {
    let type = HelperService.getClassType(target);
    if(type == "Market") {
      return "cart";
    } else if (type == "Recipe") {
      return "restaurant";
    } else {
      return "star";
    }
  }
}
