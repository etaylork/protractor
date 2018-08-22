import { utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

export class UnblindedRandomizationReport extends Report {

    id: string = "Unblinded Randomization Report";
    title: string = "UNBLINDED_RANDOMIZATION_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        await logger.debug("UnblindedRandomizationReport.hasRequiredData: user: " + user.name + " data: " + JSON.stringify(data));
        await utils.screenshot("ubrr-report-sup.png");
        return await this.displaysData(data) && await this.isUnblinded();
    }
}