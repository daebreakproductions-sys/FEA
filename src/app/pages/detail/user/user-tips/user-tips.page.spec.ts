import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTipsPage } from './user-tips.page';

describe('UserTipsPage', () => {
  let component: UserTipsPage;
  let fixture: ComponentFixture<UserTipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTipsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
