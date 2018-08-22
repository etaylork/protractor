import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

import { Page } from '../../page.page';
import { Sidebar } from '../../other/sidebar/sidebar.page';

const sidebar: Sidebar = new Sidebar();

export class DepotForecasting extends Page {

    bufferLevelTable: ElementFinder = element(by.css('*[e2e-id="buffer-level-table"]'));
    depotDemandConfidenceKnob: ElementFinder = element(by.css('*[e2e-id="depot-demand-confidence-knob"]'));
    dialogConfirmButton: ElementFinder = element(by.css('md-dialog')).element(by.buttonText('Confirm'));
    resetChangesButton: ElementFinder = element(by.xpath("//a[contains(text(),'Reset changes')]"));
    runConfirmationDialog: ElementFinder = element(by.cssContainingText("md-dialog > *","run forecast"));
    runForecastingButton: ElementFinder = element(by.buttonText("Run forecasting"));
    forecastRunningMessage: ElementFinder = element(by.cssContainingText("md-toast span","Forecast is running"));
    applyParametersButton: ElementFinder = element(by.buttonText("Apply all inventory parameters"));
    setUpdateLink: ElementFinder = element(by.binding("'UPDATE_NETWORK'"));

    inventoryDetailBody: ElementArrayFinder = element.all(by.css('.depots-forecasting .md-table tbody'));
    inventoryDetailColumns: ElementArrayFinder = element.all(by.css('.depots-forecasting .md-table thead'));
    inventoryDetailFooters: ElementArrayFinder = element.all(by.css('.depots-forecasting .md-table tfoot'));
    longWindowDials: ElementArrayFinder = element.all(by.css('.depots-forecasting knob'));
    windowDialSettings: ElementArrayFinder = element.all(by.css('.depots-forecasting text#text'));

    private inventoryDetailsSection: string = "//table[@class='depots-forecasting']";
    private rowWithDepotName = (depot: string) => "//tr[.//*[contains(text(),'"+depot+"')][contains(@class,'md-subhead')]]";

    getInventoryDetailTable = (depot: string) =>
        element(by.xpath(this.inventoryDetailsSection + this.rowWithDepotName(depot) + "//tbody"));

    getInventoryDetailFooter = (depot: string) =>
        element(by.xpath(this.inventoryDetailsSection + this.rowWithDepotName(depot) + "//tfoot"));

    setDialValue = async (index: number, value: number) =>
        await element(by.xpath("(//knob)["+index+"]//*[local-name()='text'][contains(text(),'"+value+"')]")).click();

    getDialValue = async (index: number) => Number((await element.all(by.css('text#text'))
        .get(index).getText()).replace("%",""));

    async open(): Promise<Page> {
        await sidebar.openDepotForecastingPage();
        return new DepotForecasting();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("forecasting/depot") !== -1;
    }
}
