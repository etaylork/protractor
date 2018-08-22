import { logger, UserRole, utils } from '../../../../utils';
import { Report } from '../';

export class ShipmentsReport extends Report {

    id: string = "Shipments Report";
    title: string = "SHIPMENT_REPORT_TITLE";
    linkID: string = "SHIPMENTS_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("shpsr-report-sup.png");
                return await this.displaysData(data);
            case UserRole.roles.SiteMonitor:
                await utils.screenshot("shpsr-report-smon.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in shipment-summary-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
