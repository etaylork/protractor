import { logger, Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';

export class LotDoneStep implements Step {
    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotStudyAssignmentStepReview: lot: " + JSON.stringify(lot));
        return new LotDoneStep();
    }
}