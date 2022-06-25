import { FormControl, FormGroup } from "@angular/forms";
import { isAfter, isBefore } from "date-fns";

export class StartEndDatesValidator {
    static checkDates(formGroup: FormGroup) {
        let startDate: Date = new Date((<FormControl>formGroup.controls['startDate']).value);
        let endDate: Date = new Date((<FormControl>formGroup.controls['endDate']).value);

        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        if(endDate.getFullYear() > 1970 && isAfter(startDate, endDate)) {
            // Allow end date to be null
            return { startLater: true };
        }
        return null;
    }
}
