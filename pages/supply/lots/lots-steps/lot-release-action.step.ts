import { by, EF, ele, logger, waitClick } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotReleaseActionReview } from '../lots-steps';

export class LotReleaseAction implements Step {

    section: EF = ele(by.css("[wz-title='LOT_RELEASE_ACTION']"))
    releaseLotButton: EF = this.section.element(by.buttonText("Release lot"));
    backToLotsButton: EF = this.section.element(by.buttonText("BACK TO lots"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotReleaseAction.visit()");

        if(lot.release) {
            await waitClick(this.releaseLotButton);
            return new LotReleaseActionReview();
        }
        await waitClick(this.backToLotsButton);
        return null;
    }
}