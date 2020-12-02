import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketModalPage } from './market-modal.page';

describe('MarketModalPage', () => {
  let component: MarketModalPage;
  let fixture: ComponentFixture<MarketModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
