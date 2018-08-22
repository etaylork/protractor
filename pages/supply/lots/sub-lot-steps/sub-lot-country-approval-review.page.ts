import { by, ele, EF, waitClick } from '../../../../utils';

import { Page, SubLotStep } from '../../../';
import { AddSubLotData } from '../';
import { SubLotDonePage } from '.';

export class SubLotCountryApprovalReviewPage extends Page implements SubLotStep {

    ChangeCountryApprovalButton: EF = ele.all(by.buttonText('CHANGE COUNTRY APPROVALS')).last();
    emailField: EF = ele.all(by.model("email")).last();
    passwordField: EF = ele.all(by.model("password")).last();

    async visit(data: AddSubLotData): Promise<SubLotStep> {
        await waitClick(this.emailField);
        await this.emailField.sendKeys(data.email);
        await waitClick(this.passwordField);
        await this.passwordField.sendKeys(data.password);
        await waitClick(this.ChangeCountryApprovalButton);
        return new SubLotDonePage();
    }
}