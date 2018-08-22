import { by, element, EF, waitText, waitClick, utils } from '../../../../utils';
import { PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';

export class KitReplaceDonePage {

   doneMessage: EF = element.all(by.css('[e2e-id="message"]')).get(3);
   backButton: EF = element(by.css('a.btn-next'));

   async visit(data: PatientKitData): Promise<PatientKitStep> {
        await waitText(this.doneMessage).then(async (text) => {
            if(text.indexOf('is complete') !== -1){
                await utils.screenshot('kit-replace-action-complete.png');
                return await waitClick(this.backButton);
            }else{
                throw Error('Error: failed to process the return kit correctly');
            }
        });
        return null;
    }

}