import { logger, Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { LotStudyAssignmentStep } from '../lots-steps';

export class LotCountryApprovalApprovalStep implements Step {
    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("LotCountryApprovalApprovalStep.visit(): lot: " + JSON.stringify(lot));
        return new LotStudyAssignmentStep();
    }
}