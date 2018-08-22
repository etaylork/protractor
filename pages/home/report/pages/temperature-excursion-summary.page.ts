import { utils, UserRole } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';

export class TemperatureExcursionSummaryReport extends Report {

    id: string = "Temperature Excursion Summary Report";
    title: string = "TEMPERATURE_EXURSION_SUMMARY_REPORT";
    linkID: string = "EXCURSION_SUMMARY_REPORT";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("sdr-report-sup.png");
                return await this.displaysData(data) &&
                    await this.isUnblinded();
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("sdr-report-si.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in temperature-excursion-summary-reoprt:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
