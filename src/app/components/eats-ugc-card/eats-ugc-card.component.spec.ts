import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EatsUgcCardComponent } from './eats-ugc-card.component';

describe('EatsUgcCardComponent', () => {
  let component: EatsUgcCardComponent;
  let fixture: ComponentFixture<EatsUgcCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatsUgcCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EatsUgcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
