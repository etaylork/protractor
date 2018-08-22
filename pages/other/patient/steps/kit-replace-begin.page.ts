import { by, element, EF, EFStrFunc, waitClick } from '../../../../utils';
import { PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';
import { KitReplaceReviewPage } from './';

export class KitReplaceBeginPage {

    dispenseReasonDropDown: EF = element(by.model("ctrl.inputModel"));
    nextButton: EF = element(by.css('[wz-next="ctrl.onNext(replaceForm)"]'));
    selectAllCheckBox: EF = element(by.css('[aria-label="Select All"]'));

    dropDownValue: EFStrFunc = (value: string) => element(by.css('[value="'+value+'"]'));

    async visit(data: PatientKitData): Promise<PatientKitStep> {
        await waitClick(this.dispenseReasonDropDown, 15000, this.dropDownValue(data.reason));
        await waitClick(this.dropDownValue(data.reason));
        await waitClick(this.selectAllCheckBox);
        await waitClick(this.nextButton);
        return new KitReplaceReviewPage();
    }

}