import { by, element, logger, UserRole, utils } from '../../../../utils';
import { Report } from '../'
import { TableDefinition } from 'cucumber';

const data2 = require('../data/test-data-sid.sup_BI.json');
const data3 = require('../data/test-data-sid.ce_DI.json');
const data4 = require('../data/test-data-sid.ce_BI.json');

export class SiteInventoryDetailReport extends Report {

    id: string = "Site Inventory Detail Report";
    title: string = "SITE_INVENTORY_DETAIL_REPORT_TITLE";

    headerTable: Function = (table: string) => element(by.xpath("(//thead)[" + table + "]//tr[1]"));

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        await utils.screenshot("sidr-report.png");

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("sidr-report-sup.png");
                return await this.verifyMetaData(table) && await this.displaysData(data)
                    && await this.displaysData(data2, this.header(3))
                    && await this.isUnblinded();
            case UserRole.roles.ClientExcellence:
                await utils.screenshot("sidr-report-ce.png");
                return await this.verifyMetaData(table) && await this.displaysData(data3)
                    && await this.displaysData(data4, this.header(3));
            default:
                logger.info("Couldn't match user in site-inventory-details-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }

    async hasNoVisibleData(user: UserRole): Promise<boolean> {
        let result: boolean = await super.hasNoVisibleData();

        switch(user){
            case UserRole.roles.SupplyManager:
                return result && this.isUnblinded();
            case UserRole.roles.ClientExcellence:
                return result;
            default:
                logger.debug('no user was selected for site inventory details report: hasNoVisibleData()');
                return false;
        }
    }
}