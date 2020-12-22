import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditTipsPage } from './edit-tips.page';

describe('EditTipsPage', () => {
  let component: EditTipsPage;
  let fixture: ComponentFixture<EditTipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTipsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
