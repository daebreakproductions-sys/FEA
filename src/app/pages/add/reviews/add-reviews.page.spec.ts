import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReviewsPage } from './add-reviews.page';

describe('ReviewsPage', () => {
  let component: AddReviewsPage;
  let fixture: ComponentFixture<AddReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReviewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
