import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDealsPage } from './edit-deals.page';

describe('EditDealsPage', () => {
  let component: EditDealsPage;
  let fixture: ComponentFixture<EditDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
