import { by, ele, EF, logger, waitClick } from '../../../../utils';

import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotReleaseAction } from '../lots-steps';

export class AddLotReview implements Step {

    section: EF = ele(by.css("[wz-title='ADD_LOT_REVIEW']"));
    createLotButton: EF = this.section.element(by.buttonText("CREATE lot"));
    lotNumberLabel: EF = this.section.element(by.cssContainingText(".field-review-label","Lot number"));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("AddLotReview.visit(): lot: " + JSON.stringify(lot));

        await waitClick(this.lotNumberLabel);
        await waitClick(this.createLotButton);

        return new LotReleaseAction();
    }
}