import { utils } from '../../../../../utils';
import { logger } from '../../../../../utils/logger';

import { Report } from '../../';
import { UserRole } from '../../../../../utils/user.role';

export class PatientSummaryReport extends Report {

    id: string = "Patient Summary Report";
    title: string = "PATIENT_SUMMARY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("psr-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.CSL:
                await utils.screenshot("psr-report-csl.png");
                return await this.displaysData(data) && await this.isUnblinded();
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("psr-report-si.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in patient-summary-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}