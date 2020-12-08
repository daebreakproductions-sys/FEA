import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTipsPage } from './add-tips.page';

describe('TipsPage', () => {
  let component: AddTipsPage;
  let fixture: ComponentFixture<AddTipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
