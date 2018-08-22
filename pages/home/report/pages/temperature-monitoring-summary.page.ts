import { utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

const testData1 = require('../data/test-data-tmsr.sup.json');
const testData2 = require('../data/test-data-tmsr.si.json')

export class TemperatureMonitoringSummaryReport extends Report {

    id: string = "Temperature Monitoring Summary Report";
    title: string = "TEMPERATURE_MONITORING_SUMMARY_REPORT";

    async hasRequiredData(user: UserRole, data: {}) {
        await logger.debug("TemperatureMonitoringSummaryReport.hasRequireData: user: " + user.name +
            " data: " + JSON.stringify(data));

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("tmsr-report-sup.png");
                return await this.displaysData(testData1) && await this.isUnblinded()
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("tmsr-report-si.png");
                return await this.displaysData(testData2);
            default:
                logger.info("Couldn't match user in temperature-monitoring-summary:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}