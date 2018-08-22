import { utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

export class ResupplyHistoryReport extends Report {

    id: string = "Resupply History";
    title: string = "RESUPPLY_SUMMARY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        await logger.debug("ResupplyHistoryReport.hasRequiredData: user: " + user.name + " data: " + JSON.stringify(data));
         await utils.screenshot("resupply-history-report-csl.png");
         return await this.displaysData(data) && await this.isUnblinded();
     }
}