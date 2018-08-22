import { logger, Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotStudyAssignmentStepReview } from '../lots-steps';

export class LotStudyAssignmentStep implements Step {
    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotStudyAssignmentStep: lot: " + JSON.stringify(lot));
        return new LotStudyAssignmentStepReview();
    }
}