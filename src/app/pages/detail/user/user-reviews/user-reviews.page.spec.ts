import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserReviewsPage } from './user-reviews.page';

describe('UserTipsPage', () => {
  let component: UserReviewsPage;
  let fixture: ComponentFixture<UserReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReviewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
