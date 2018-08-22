import { browser, by, ElementFinder, utils, waitClick } from '../../../utils';

import { ForecastingSetup } from '../../../pages/forecasting/forecasting-setup/forecasting-setup.page';
import { TableValidation } from '../../../pages/other/validation/table/table-validation.page';

const { When } = require("cucumber");

const forecastingSetup: ForecastingSetup = new ForecastingSetup();

When(/^open the '(Enrollment Groups|Network|Minimum Site Safety Stock)' tab$/,
    async function (tab: string) {
        if(tab.indexOf("Enrollment Groups") !== -1) {
            await waitClick(forecastingSetup.entrollmentTab);
        } else if(tab.indexOf("Network") !== -1) {
            await waitClick(forecastingSetup.networkTab);
        } else {
            await waitClick(forecastingSetup.safetyTab);
        }
    });

When(/^set '(Depot SW|default)' to (\d+)$/,
    async function (field: string, value: number) {
        if(field.indexOf("Depot SW") !== -1) {
            await forecastingSetup.setDepotSW(value);
        }
    });

When(/^apply changes$/,
    async function () {
        await waitClick(forecastingSetup.applyChangesButton);
        await waitClick(forecastingSetup.confirmButton);
    });

When(/^open the site view$/,
    async function () {
        await waitClick(forecastingSetup.siteViewLink);
    });

When(/^set 'initial site shipment' to todays date$/,
    async function () {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());
        let targetFunction = async function (target: ElementFinder) {
            await browser.executeScript("arguments[0].click()", target.element(by.css("button")).getWebElement());
            await waitClick(target.element(by.xpath("//*[contains(@class,'md-calendar-date-today')]")));
        }
        await TableValidation.setValue(forecastingSetup.networkSiteTable,
            "Site", "101", "Date of initial site shipment", targetFunction);
        await waitClick(forecastingSetup.applyChangesButton);
        await waitClick(forecastingSetup.confirmButton);
        await utils.screenshot('initial-site-shipment-date-to-today.png')
    });