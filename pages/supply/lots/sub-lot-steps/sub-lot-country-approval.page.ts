import { by, ele, EF, waitClick } from '../../../../utils';

import { Page, SubLotStep } from '../../../';
import { AddSubLotData } from '../';
import { SubLotCountryApprovalReviewPage } from '.';

export class SubLotCountryApprovalPage extends Page implements SubLotStep {

    nextButton: EF = ele.all(by.buttonText('Next')).first();
    selectLink: EF = ele(by.linkText('Select all'));

    async visit(data: AddSubLotData): Promise<SubLotStep> {
        await waitClick(this.selectLink);
        await waitClick(this.nextButton);
        return new SubLotCountryApprovalReviewPage();
    }
}