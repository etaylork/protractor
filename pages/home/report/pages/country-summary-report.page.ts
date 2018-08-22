import { logger, UserRole, utils } from '../../../../utils';

import { Report } from '../';

export class CountrySummaryReport extends Report {

    id: string = "Country Summary Report";
    title: string = "COUNTRY_SUMMARY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        await utils.screenshot("csr-report.png");

        switch (user) {
            case UserRole.roles.StudyManager:
                return this.displaysData(data)
            default:
                logger.info("Couldn't match user in country summary report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}