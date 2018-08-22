import { Process, Step } from '../../../';
import { AddSubLotData } from '../';

import * as steps from '../sub-lot-steps';

export class AddSubLotProcess implements Process {

    data: AddSubLotData;

    constructor (data: AddSubLotData) {
        this.data = data;
    }

    async run (): Promise<void> {

        let step: any = new steps.AddSubLotPage();

        do {
            step = await step.visit(this.data);
        } while (step !== null);

    }
}
