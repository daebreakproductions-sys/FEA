import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export class PasswordValidator {
    static passwordsSame(formGroup: UntypedFormGroup) {
        let val;
        let valid = true;
        let pass: UntypedFormControl = <UntypedFormControl>formGroup.controls['password'];
        let passConfirm: UntypedFormControl = <UntypedFormControl>formGroup.controls['passwordConfirm'];
    
        // for (let key in formGroup.controls) {
        //     if (formGroup.controls.hasOwnProperty(key)) {
        //         let control: FormControl = <FormControl>formGroup.controls[key];
        //         if (val === undefined) {
        //             val = control.value
        //         } else {
        //             if (val !== control.value) {
        //                 valid = false;
        //                 break;
        //             }
        //         }
        //     }
        // }
        if (pass.value == passConfirm.value) {
            return null;
        }
        return { passwordsEqual: true }
        
     }
}
