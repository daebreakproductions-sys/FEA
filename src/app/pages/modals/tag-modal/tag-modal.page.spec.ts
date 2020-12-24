import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TagModalPage } from './tag-modal.page';

describe('TagModalPage', () => {
  let component: TagModalPage;
  let fixture: ComponentFixture<TagModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TagModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
