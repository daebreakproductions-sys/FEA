import { Injectable } from '@angular/core';
import { Deal } from '@app/models/deal';
import { EatsDate } from '@app/models/eats-date';
import { Entity } from '@app/models/entity';
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

}
