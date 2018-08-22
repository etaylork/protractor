import { by, element, EF, waitText, waitClick, utils } from '../../../../utils';
import { PatientKitData } from '../interfaces/patient-kit-data.interface';

export class KitReturnDonePage {

   doneMessage: EF = element.all(by.css('[e2e-id="message"]')).get(3);
   backButton: EF = element(by.css('a.btn-next'));

   async visit(data: PatientKitData): Promise<void>{
        await waitText(this.doneMessage).then(async (text) => {
            if(text.indexOf('is complete') !== -1){
                await utils.screenshot('kit-return-done-action.png');
                return await waitClick(this.backButton);
            }else{
                throw Error('Error: failed to process the return kit correctly');
            }
        });
        return null;
    }

}