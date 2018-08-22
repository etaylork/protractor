import { by, EF, ele, logger, waitClick } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotCountryApprovalStep } from '../lots-steps';

/**
 * Also known as the Country selection section
 */
export class LotApproveReleaseAction implements Step {

    section: EF = ele(by.css("[wz-title='LOT_COUNTRY_APPROVAL_STEP']"));
    selectAllLink: EF = this.section.element(by.linkText("Select all"));
    nextButton: EF = this.section.element(by.buttonText("Next"));
    backToLotsButton: EF = this.section.element(by.buttonText("BACK TO lots"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotApproveReleaseAction.visit()");

        if(lot.country.indexOf("all") !== -1) {
            await waitClick(this.selectAllLink);
            await waitClick(this.nextButton);
            return new LotCountryApprovalStep();
        } else {
            await waitClick(this.backToLotsButton);
            return null;
        }
    }
}