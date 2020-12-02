import { FormControl, FormGroup } from "@angular/forms";

export class StartEndDatesValidator {
    static checkDates(formGroup: FormGroup) {
        let startDate: Date = new Date((<FormControl>formGroup.controls['startDate']).value);
        let endDate: Date = new Date((<FormControl>formGroup.controls['endDate']).value);

        if(endDate <= startDate) {
            return { startLater: true };
        }
        return null;
    }
}
