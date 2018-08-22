import { by, EF, ele, logger, waitClick } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotCountryApprovalReview } from '../lots-steps';

export class LotCountryApprovalStep implements Step {

    section: EF = ele(by.css("[wz-title='LOT_COUNTRY_APPROVAL_REVIEW']"));
    changeCountryApprovalButton: EF = this.section.element(by.buttonText("CHANGE COUNTRY APPROVALS"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotCountryApprovalStep.visit(): lot: " + JSON.stringify(lot));

        await waitClick(this.changeCountryApprovalButton);

        return new LotCountryApprovalReview();
    }
}