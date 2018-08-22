import { utils, UserRole } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';

export class PatientCentricAuditTrailReport extends Report {

    id: string = "Patient Centric Audit Trail";
    title: string = "PATIENT_CENTRIC_AUDIT_TRAIL";

    async hasRequiredData(user: UserRole, data: {}) {

        await utils.screenshot("pcatr-report.png");

        switch (user) {
            case UserRole.roles.CSL:
                return await this.displaysData(data);
            case UserRole.roles.ClientExcellence:
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in patient-centric-audit-trail:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
