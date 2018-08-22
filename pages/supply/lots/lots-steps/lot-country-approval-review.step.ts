import { by, EF, ele, logger, waitClick, utils } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';

export class LotCountryApprovalReview implements Step {

    section: EF = ele(by.css("[wz-title='LOT_DONE_STEP']"))
    backToLotsButton: EF = this.section.element(by.buttonText("BACK TO lots"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotCountryApprovalsReview.visit(): lot: " + JSON.stringify(lot));
        await utils.screenshot('lot-country-approval-page.png');
        await waitClick(this.backToLotsButton);

        return null;
    }
}