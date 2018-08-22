import { by, ele, EF, waitClick, utils } from '../../../../utils';

import { Page, SubLotStep } from '../../../';
import { AddSubLotData } from '../';

export class SubLotDonePage extends Page implements SubLotStep {

    backToLotsButton: EF = ele.all(by.buttonText("BACK TO lots")).last();

    async visit(data: AddSubLotData): Promise<SubLotStep> {
        await utils.screenshot('sub-lot-done-page.png');
        await waitClick(this.backToLotsButton);
        return null;
    }
}