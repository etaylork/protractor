import { logger, utils } from '../../../../../utils';
import { TableDefinition } from 'cucumber';

import { Report } from '../../';
import { UserRole } from '../../../../../utils/user.role';

export class PatientDetailReport extends Report {

    id: string =  "Patient Detail Report";
    title: string = "SUBJECT_DETAIL_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        await utils.screenshot("pdr-report.png");

        switch (user) {
            case UserRole.roles.StudyManager:
                return await this.verifyMetaData(table) &&
                    await this.displaysData(data);
            case UserRole.roles.CSL:
                return await this.verifyMetaData(table) &&
                    await this.displaysData(data) &&
                    await this.isUnblinded();
            default:
                logger.info("Couldn't match user in patient-detail-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
