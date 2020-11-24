import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FDCService } from '@app/lib/usda';
 
@Injectable({
  providedIn: 'root'
})
export class DataResolverService {

  constructor(private dataService: FDCService) { }
 
  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.dataService.getFood(id);
  }
}
