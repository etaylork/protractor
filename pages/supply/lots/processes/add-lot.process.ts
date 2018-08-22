import { Process, Step } from '../../../';
import { AddLotData } from './add-lot.process';

import * as steps from '../lots-steps';

export class AddLotProcess implements Process {

    data: AddLotData;

    constructor (data: AddLotData) {
        this.data = data;
    }

    async run (): Promise<void> {

        let step: Step = new steps.AddLot();

        do {
            step = await step.visit(this.data);
        } while (step !== null);

    }
}

export { AddLotData } from '../interfaces/add-lot-data.interface';
