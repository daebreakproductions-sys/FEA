import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserRecipesPage } from './user-recipes.page';

describe('UserTipsPage', () => {
  let component: UserRecipesPage;
  let fixture: ComponentFixture<UserRecipesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecipesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
