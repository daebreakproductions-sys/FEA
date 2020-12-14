import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealDetailPage } from './deal-detail.page';

describe('DealPage', () => {
  let component: DealDetailPage;
  let fixture: ComponentFixture<DealDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
