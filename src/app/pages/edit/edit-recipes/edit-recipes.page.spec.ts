import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditRecipesPage } from './edit-recipes.page';

describe('EditDealsPage', () => {
  let component: EditRecipesPage;
  let fixture: ComponentFixture<EditRecipesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRecipesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecipesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
