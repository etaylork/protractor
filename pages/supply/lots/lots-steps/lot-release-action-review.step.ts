import { by, EF, ele, logger, waitClick, utils } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotApproveReleaseAction } from '../lots-steps';

export class LotReleaseActionReview implements Step {

    section: EF = ele(by.css("[wz-title='LOT_RELEASE_ACTION_REVIEW']"));
    emailInput: EF = this.section.element(by.css("input[name='email']"));
    passwordInput: EF = this.section.element(by.css("input[name='password']"));
    releaseLotButton: EF = this.section.element(by.buttonText("Release lot"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotReleaseActionReview.visit()");

        await waitClick(this.emailInput);
        await this.emailInput.sendKeys(lot["user"]);
        await waitClick(this.passwordInput);
        await this.passwordInput.sendKeys(lot["password"]);
        await utils.screenshot('lot-release-review-page.png');
        await waitClick(this.releaseLotButton);

        return new LotApproveReleaseAction();
    }
}