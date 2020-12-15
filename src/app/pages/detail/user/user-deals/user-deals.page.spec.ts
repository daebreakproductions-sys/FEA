import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserDealsPage } from './user-deals.page';

describe('UserDealsPage', () => {
  let component: UserDealsPage;
  let fixture: ComponentFixture<UserDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
