import { Injectable } from '@angular/core';
import { EatsDate } from '@app/models/eats-date';
import { Entity } from '@app/models/entity';
import { User } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

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
}
