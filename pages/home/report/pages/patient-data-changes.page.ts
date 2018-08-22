import { utils } from '../../../../utils';
import { logger } from "../../../../utils/logger";

import { Report } from "../";
import { UserRole } from "../../../../utils/user.role";

export class PatientDataChangesReport extends Report {

    id: string = "Patient Data Changes Report";
    title: string = "SUBJECT_DATA_CHANGES_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("pdcr-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("pdcr-report-si.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in patient-data-changes-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
