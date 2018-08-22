import { browser, by, element, ElementFinder, logger, sidebar, utils, waitClick } from '../../../utils';

import { Page } from '../../page.page';

export class DepotResupplyPage extends Page {

    runResupplyButton: ElementFinder = element(by.buttonText("Run resupply"));
    runResupplyConfirmationButton: ElementFinder = element(by.cssContainingText("md-dialog button", "Confirm"));
    resupplyRunSuccessMessage: ElementFinder = element(by.cssContainingText("prancer-message", "Resupply run completed successfully"));
    shipmentRequest: ElementFinder = element(by.cssContainingText("prancer-message", "Shipments requests created/updated:"));
    depotInventoryReportLink = element(by.css('a[ng-click="ctrl.goToDepotInventorySummaryReport(row.shipment_to)"]'));
    createShipmentFormLink = element(by.css('a[ng-click="ctrl.createShipmentFromSr(row.id)"]'));


    async open(): Promise<Page> {
        logger.debug("sidebar.page.openDepotSupplyPage");
        if(!await this.isCurrentPage()) {
            await utils.screenshot("opening-depot-resupply-page.png");
            if(!await sidebar.depotSupplyLink.isDisplayed()) {
                await waitClick(sidebar.supplyLink);
            }
            await utils.screenshot("clicked-supply-link.png");
            await waitClick(sidebar.depotSupplyLink);
            await utils.screenshot("clicked-depot-supply-link.png");
        }
        await utils.logStudy();
        return new DepotResupplyPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("supply/depot-resupply") !== -1;
    }
}