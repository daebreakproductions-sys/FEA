import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FolloweesPage } from './followees.page';

describe('FolloweesPage', () => {
  let component: FolloweesPage;
  let fixture: ComponentFixture<FolloweesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolloweesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FolloweesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
