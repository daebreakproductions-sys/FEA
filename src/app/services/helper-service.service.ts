import { Injectable } from '@angular/core';
import { EatsDate } from '@app/models/eats-date';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public EatsDateToDate(input: EatsDate) : Date {
    return new Date(Number(input.epochSecond) * 1000);
  }
}
