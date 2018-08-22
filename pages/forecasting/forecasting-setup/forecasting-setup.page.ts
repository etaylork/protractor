import { browser, by, element, ElementFinder, Key, waitClick } from '../../../utils';

import { DepotForecasting } from '../depot-forecasting/depot-forecasting.page'; 
import { Page } from '../../page.page';
import { Sidebar } from '../../other/sidebar/sidebar.page';

const sidebar: Sidebar = new Sidebar();
const depotForecastingPage: DepotForecasting = new DepotForecasting();

export class ForecastingSetup extends Page {

    entrollmentTab: ElementFinder = element(by.cssContainingText("md-tab-item", "Enrollment Groups"));
    networkTab: ElementFinder = element(by.cssContainingText("md-tab-item", "Network"));
    safetyTab: ElementFinder = element(by.cssContainingText("md-tab-item", "Minimum Site Safety Stock"));
    depotField: ElementFinder = element(by.model("depot_country.depot"));
    optionPrimary: ElementFinder = element.all(by.cssContainingText("md-option div","Primary US Depot")).last();
    depotSWInput: ElementFinder = element(by.xpath("//*[@e2e-id='depot-sw-form']/input"));
    applyChangesButton: ElementFinder = element(by.buttonText("Apply changes"));
    siteViewLink: ElementFinder = element(by.linkText("Site view"));
    networkSiteTable: ElementFinder = element.all(by.css("table")).get(1);

    async open(): Promise<Page> {
        await sidebar.openDepotForecastingPage();
        await waitClick(depotForecastingPage.setUpdateLink);
        return new ForecastingSetup();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("forecasting/setup") !== -1;
    }

    async setDepotSW(value: number) {
        await waitClick(this.depotField);
        await waitClick(this.optionPrimary);
        await waitClick(this.depotSWInput);
        await this.depotSWInput.clear();
        await this.depotSWInput.sendKeys(value);
        await this.depotSWInput.sendKeys(Key.RETURN);
    }

    async openNetworkTab() {
        await waitClick(this.networkTab);
    }
}
