import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TagContentPage } from './tag-content.page';

describe('TagContentPage', () => {
  let component: TagContentPage;
  let fixture: ComponentFixture<TagContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TagContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
