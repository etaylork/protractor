import { by, element, EF, waitClick } from '../../../../utils';
import { KitReturnReviewPage } from './kit-return-review.page';
import {  PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';

export class QuantityToReturnPage {

   quantityField: EF = element.all(by.css("input[placeholder='Quantity']")).first();
   nextButton: EF = element(by.css('[wz-next="ctrl.onNext(innerQtyForm)"]'));

   async visit(data: PatientKitData): Promise<PatientKitStep> {
        await this.quantityField.clear();
        await this.quantityField.sendKeys(data.quantity);
        await waitClick(this.nextButton);
        return await new KitReturnReviewPage();
    }

}