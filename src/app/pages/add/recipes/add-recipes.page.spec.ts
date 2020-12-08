import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRecipesPage } from './add-recipes.page';

describe('RecipesPage', () => {
  let component: AddRecipesPage;
  let fixture: ComponentFixture<AddRecipesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecipesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
