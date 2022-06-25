import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonDatetime, IonPopover } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-popup-date',
  templateUrl: './popup-date.component.html',
  styleUrls: ['./popup-date.component.scss'],
  inputs: ['label', 'popupId', 'initialValue'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: PopupDateComponent
    }
  ]
})
export class PopupDateComponent implements ControlValueAccessor {
  @ViewChild('date') dateControl: IonDatetime;
  @ViewChild(IonPopover) popover: IonPopover;
  label: string|null = null;
  popupId: string = 'date-chooser';
  initialValue: string = this._now();

  public dateDisplay: string;
  public dateValue: string;

  public minDate: string;
  public maxDate: string;
  public now: string;

  constructor() { }

  ngOnInit() {
    this.minDate = this._minDate();
    this.maxDate = this._maxDate();
    this.dateValue = this.initialValue;
    if(this.initialValue != null) {
      this.dateDisplay = format(parseISO(this.initialValue).setHours(0,0,0,0), 'MMM d, yyyy');
    }
  }

  readonly oneMonth: number = 1000 * 60 * 60 * 24 * 30;
  private _minDate() {
    let now = new Date();
    now.setTime(Date.now() - this.oneMonth);
    return now.toISOString();
  }
  private _maxDate() {
    let now = new Date();
    now.setTime(Date.now() + this.oneMonth);
    return now.toISOString();
  }
  private _now() {
    let dt = new Date();
    return dt.toISOString();
  }

  public cancelButton() {
    this.dateValue = null;
    this.updateDate(null);
    this.dateControl.reset();
    this.popover.dismiss();
  }
  public selectButton() {
    if(this.dateControl.value == null) {
      this.dateValue = this._now();
      this.updateDate(this._now());
    } else {
      this.dateValue = this.dateControl.value;
      this.updateDate(this.dateControl.value);
    }
    this.popover.dismiss();
  }

  public popoverOpening() {
    this.markAsTouched();
    this.dateControl.value = this.dateValue;
  }
  public updateDate(date: string) {
    this.markAsTouched();
    this.onChange(date);
    this.dateValue = date;
    if(date != null) {
      this.dateDisplay = format(parseISO(date).setHours(0,0,0,0), 'MMM d, yyyy');
    } else {
      this.dateDisplay = null;
    }
  }

  onChange = (dateValue) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  writeValue(dateValue: string) {
    this.dateValue = dateValue;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
