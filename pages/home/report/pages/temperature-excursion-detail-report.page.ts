import { utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';

import { Report } from '../';
import { UserRole } from '../../../../utils/user.role';
import { TableDefinition } from 'cucumber';

const dataSup = require('../data/test-data-tedr.sup.tbl2.json');
const dataSi = require('../data/test-data-tedr.si.tbl2.json');

export class TemperatureExcursionDetailReport extends Report {

    id: string = "Temperature Excursion Detail Report";
    title: string = "TEMPERATURE_EXCURSION_DETAIL_REPORT";
    linkID: string = "EXCURSION_DETAIL_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("tedr-report-sup.png");
                return await this.verifyMetaData(table) && await this.displaysData(data)
                    && await this.displaysData(dataSup, this.header(3)) &&
                        await this.isUnblinded();
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("tedr-report-si.png");
                return await this.verifyMetaData(table) &&
                    await this.displaysData(data) &&
                    await this.displaysData(dataSi, this.header(3));
            default:
                logger.info("Couldn't match user in temp-excursion-detail-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}