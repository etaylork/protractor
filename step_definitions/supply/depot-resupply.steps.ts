import { expect, browser, by, element, utils, waitClick } from '../../utils';
import { logger } from '../../utils/logger';

import { DepotResupplyPage } from '../../pages/supply/resupply/depot-resupply.page';
import { TableValidation } from '../../pages/other/validation/table/table-validation.page'

const { When, Then } = require("cucumber");

const testData = require("./data/depot-resupply.data.json");

const depotResupplyPage: DepotResupplyPage = new DepotResupplyPage();

When(/^depot resupply is run$/,
    async function () {
        let temp = browser.params.timeout;
        browser.params.timeout = 40000;
        await waitClick(depotResupplyPage.runResupplyButton);
        await waitClick(depotResupplyPage.runResupplyConfirmationButton);
        await browser.sleep(2000);
        if(await depotResupplyPage.runResupplyConfirmationButton.isPresent()) {
            await utils.screenshot("failed-confirmation-click.png");
            await logger.debug("Failed confirmation click on depot resupply page!!!")
            await utils.refresh();
            await utils.screenshot("failed-confirmation-click-utils-refresh.png")
            await depotResupplyPage.open();
            await utils.screenshot("failed-confirmation-click-depot-resupply-open.png")
            await waitClick(depotResupplyPage.runResupplyButton);
            await waitClick(depotResupplyPage.runResupplyConfirmationButton);
        }
        await utils.screenshot("depot-resupply-run.png");
        browser.params.timeout = temp;
    });

When(/^click on the available inventory link for '(.*?)'$/,
    async function (depot: string) {
        await depotResupplyPage.filterColumn("Depot", depot);
        await waitClick(depotResupplyPage.depotInventoryReportLink);
    });

When(/^I open the create shipment form for '(.*?)'$/,
    async function (depot: string) {
        await depotResupplyPage.filterColumn("Depot", depot);
        await waitClick(depotResupplyPage.createShipmentFormLink);
        await utils.screenshot('create-shipment-form.png');
    })

Then(/^run is successful and shipment request is displayed(?: - '(.*?)')?$/,
    async function (key: string) {
        let message1 = depotResupplyPage.resupplyRunSuccessMessage;
        let message2 = depotResupplyPage.shipmentRequest;
        await utils.waitVisible(message1, 240000);
        await utils.waitVisible(message2);
        expect(await message1.isDisplayed()).to.be.true;
        expect(await message2.isDisplayed()).to.be.true;
        await utils.screenshot("depot-resupply-completed.png");
        if("shipment-request-data-01".indexOf(key) !== -1) {
            await browser.actions()
                .mouseMove(element(by.cssContainingText("thead tr th", "Shipping Quantity"))) // 100px from left, 100 px from top of plot0
                .perform();
            await utils.screenshot("before-data-check-check-check-check.png");
        }
        if(key) {
            expect(await TableValidation.containsData(depotResupplyPage.tbody, testData[key]));
        }
    });

