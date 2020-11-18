import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserOptionsPage } from './user-options.page';

describe('UserOptionsPage', () => {
  let component: UserOptionsPage;
  let fixture: ComponentFixture<UserOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
