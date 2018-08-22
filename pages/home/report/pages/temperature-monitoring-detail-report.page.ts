import { utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';
import { TableDefinition } from 'cucumber';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';

const testData1 = require('../data/test-data-tmdr.tbl2.sup.json');
const testData2 = require('../data/test-data-tmdr.tbl2.si.json');

export class TemperatureMonitoringDetailsReport extends Report {

    id: string = "Temperature Monitoring Details Report";
    title: string = "TEMPERATURE_MONITORING_DETAILS_REPORT";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("tmdr-report-sup.png");
                return await this.verifyMetaData(table)
                    && await this.displaysData(data) && await this.isUnblinded()
                    && await this.displaysData(testData1, this.header(3));
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("tmdr-report-si.png");
                return await this.verifyMetaData(table) && await this.displaysData(data)
                    && await this.displaysData(testData2, this.header(3));
            default:
                logger.info("Couldn't match user in temperature-monitoring-details-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}