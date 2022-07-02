import { Injectable } from '@angular/core';
import { Deal } from '@app/models/deal';
import { EatsDate } from '@app/models/eats-date';
import { Entity } from '@app/models/entity';
import { Market } from '@app/models/market';
import { Tip } from '@app/models/tip';
import { User } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public static PopulateDeal(deal: Deal): Deal {
    deal.startDate = new EatsDate(deal.startDate);
    deal.endDate = new EatsDate(deal.endDate);
    deal = <Deal>this.PopulateEntity(deal);
    return deal;
  }
  public static PopulateTip(tip: Tip): Tip {
    return <Tip>this.PopulateEntity(tip);
  }
  public static PopulateMarket(mkt: Market): Market {
    return <Market>this.PopulateEntity(mkt);
  }
  public static PopulateEntity(entity: Entity) : Entity {
    entity.created = new EatsDate(entity.created);
    entity.modified = new EatsDate(entity.modified);
    return entity;
  }
  public static PopulateUser(entity: User) : User {
    entity.created = new EatsDate(entity.created);
    entity.modified = new EatsDate(entity.modified);
    return entity;
  }
  public EatsDateToDate(input: EatsDate) : Date {
    return new Date(Number(input.epochSecond) * 1000);
  }
  public static isNumber(value: string | number): boolean
  {
     return ((value != null) &&
             (value !== '') &&
             !isNaN(Number(value.toString())));
  }
  public static readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            resolve('');
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = reader.result.toString();
            resolve(text);

        };

        reader.readAsDataURL(file);
    });
  }
  distance(lat1:number, lon1:number, lat2:number, lon2:number, unit:string = "M"): number {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  getClassType(entity: Entity): string {
    return entity.class.split('.').pop();
  }

}
