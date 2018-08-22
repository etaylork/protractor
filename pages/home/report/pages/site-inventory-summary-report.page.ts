import { logger, UserRole, utils } from '../../../../utils';
import { Report } from '../';

export class SiteInventorySummaryReport extends Report {

    id: string = "Site Inventory Summary Report";
    title: string = "SITE_INVENTORY_SUMMARY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("sisr-report-sup.png");
                return await this.displaysData(data) && await this.isUnblinded();
            case UserRole.roles.ClientExcellence:
                await utils.screenshot("sisr-report-si.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in site-inventory-summary-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
