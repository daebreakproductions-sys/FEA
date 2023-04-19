import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { TagService } from './tag.service';
import { EatsLocationsService } from './eats-locations.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private initialized: boolean = false;

  constructor(
    private locationsService: EatsLocationsService,
    private tagService: TagService,
    private userService: UserService,
  ) { }

  public initializeServicesOnce() {
    if(!this.initialized) {
      this.locationsService.init();
      this.tagService.init();
      this.userService.init();
      this.initialized = true;
    }
  }
}
