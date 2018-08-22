import { by, element } from '../../../utils';

import { PatientPage } from './patient.page';

export class ScreenFailPatientPage extends PatientPage {

    screenFailField = element(by.css('[data-code="sfreason"]')).element(by.model('ngModel'));
    screenFailedReasonMessage = element(by.css('span.field-review'));
    
    //low-level functions
    async enterScreenFailedReason(reason: string){
        await this.screenFailField.clear();
        await this.screenFailField.sendKeys(reason)
    }

}