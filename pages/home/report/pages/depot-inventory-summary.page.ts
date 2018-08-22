import { logger, UserRole, utils } from '../../../../utils';
import { Report } from '../';

export class DepotInventorySummaryReport extends Report {

    id: string = "Depot Inventory Report";
    title: string = "DEPOT_INVENTORY_REPORT_LINK";

    async hasRequiredData(user: UserRole, data: {}) {

        await utils.screenshot("disr-report.png");

        switch (user) {
            case UserRole.roles.SupplyManager:
                return await this.displaysData(data) && await this.isUnblinded();
            default:
                logger.info("Couldn't match user in depot-inventory-summary-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}