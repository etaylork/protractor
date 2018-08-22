import { by, element, EF, waitClick } from '../../../../utils';
import { KitReturnDonePage } from './';
import { PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';

export class KitReturnReviewPage {

   submitButton: EF = element(by.css('[on-finish="finishedWizard()"]')).element(by.buttonText('Submit'));
   
   async visit(data: PatientKitData): Promise<PatientKitStep> {
        await waitClick(this.submitButton);
        return await new KitReturnDonePage();
    }

}