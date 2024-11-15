import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EatsPgUgcCardComponent } from './eats-pg-ugc-card.component';

describe('EatsPgUgcCardComponent', () => {
  let component: EatsPgUgcCardComponent;
  let fixture: ComponentFixture<EatsPgUgcCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatsPgUgcCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EatsPgUgcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
