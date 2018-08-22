import { logger, utils  } from '../../../../utils';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

export class CohortHistoryReport extends Report {

    id: string =  "Cohort History Report";
    title: string = "COHORT_HISTORY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.CSL:
                await utils.screenshot("chr-report-csl.png");
                return await this.displaysData(data)
            case UserRole.roles.StudyManager:
                await utils.screenshot("chr-report-sm.png");
                return await this.displaysData(data)
            default:
                logger.info("Couldn't match user in cohort history report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}