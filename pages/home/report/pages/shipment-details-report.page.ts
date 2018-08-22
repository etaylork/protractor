import { logger, Report, UserRole, utils } from '../';

export class ShipmentDetailsReport extends Report {

    id: string = "Shipment Details Report";
    title: string = "SHIPMENT_DETAILS_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.SupplyManager:
                await utils.screenshot("shpdp-report-sup.png");
                return await this.displaysData(data) &&
                    await this.isUnblinded();
            case UserRole.roles.StudyManager:
                await utils.screenshot("shpdp-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.Pharmacist:
                await utils.screenshot("shpdp-report-pt.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in shipment details report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}