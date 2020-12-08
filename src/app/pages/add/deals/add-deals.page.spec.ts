import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddDealsPage } from './add-deals.page';

describe('DealsPage', () => {
  let component: AddDealsPage;
  let fixture: ComponentFixture<AddDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
