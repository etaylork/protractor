import { by, ele, EF, waitClick } from '../../../../utils';

import { Page, SubLotStep } from '../../../';
import { AddSubLotData } from '../';
import { SubLotCountryApprovalPage } from '.';

export class SubLotReviewPage extends Page implements SubLotStep {

    createSubLotButton: EF = ele(by.buttonText("CREATE sub-lot"));

    async visit(data: AddSubLotData): Promise<SubLotStep> {
        await waitClick(this.createSubLotButton);
        return new SubLotCountryApprovalPage();
    }
}