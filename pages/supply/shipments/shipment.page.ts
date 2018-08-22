import { logger, browser, by, element, EAF, EF, EFStrFunc, utils, sidebar, Page, waitText, waitClick, TableDefinition } from '../../../utils';

import { DispatchShipmentPage } from './dispatch_shipment.page';
import { Shipments, Shipment } from './support/shipment';
import { By } from 'selenium-webdriver';

let dispatchPage: DispatchShipmentPage = new DispatchShipmentPage();

export class ShipmentPage extends Page {

    intactCheckboxLocator: By = by.xpath('./td[2]/md-checkbox');
    damagedCheckboxLocator: By = by.xpath('./td[3]/md-checkbox');
    lostCheckboxLocator: By = by.xpath('./td[4]/md-checkbox');
    backToShipmentsButton: EF = element(by.buttonText("Back to Shipments"));
    cancelShipmentButton: EF = element(by.buttonText("Cancel Shipment"));
    createSiteShipmentButton: EF = element(by.id("add_site_shipment_btn"));
    createDepotShipmentButton: EF = element(by.id("add_depot_shipment_btn"));
    unblindReceiveShipmentButton: EF = element(by.css('button[wz-next="ctrl.handleShipmentAction(shipment,action)"]'));
    noShipmentsMessage: EF = element(by.css('h3.md-subhead.ng-binding.ng-scope'));
    checkBoxRow: EF = element(by.xpath("//md-checkbox[@aria-checked='true']/ancestor::tr"));
    bulkKitRows: EAF = element.all(by.repeater("kit in Kits"));
    confirmTempExcursionCheckBox: EF = element(by.model('shipment.tempExcursion'));
    allRows: EAF = element.all(by.repeater('row in ctrl.inventory | filter:'));
    allBulkRows:EAF = element.all(by.repeater("row in ctrl.inventory | orderBy"));
    allBulkQuantityFields:EAF = element.all(by.model('row[status]'));
    reviewNextButton: EF = element.all(by.buttonText('Next')).last();
    sourceField: EF = element(by.model('model.source'));


    actions: EAF  = element.all(by.repeater('action in actions'));
    shipmentRows: EAF = element.all(by.css('tbody > tr'));

    receiveShipmentButton: EF = element.all(by.buttonText("Receive Shipment")).last();

    private actionMenuPath = "//body/*[contains(@id,'menu_container')]";
    private actionWithText = (action: string): string => "//button[contains(text(),'"+action+"')]"

    action = async (action: string): Promise<EF> =>
        element(by.xpath(this.actionMenuPath + this.actionWithText(action)));

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("shipments") !== -1;
    }

    async open(): Promise<Page> {
        logger.debug("Opening shipments page");
        await sidebar.openShipmentsPage();
        await utils.logStudy();
        return new ShipmentPage();
    }

    private shipmentActions = (shipmentTo: string): EF =>
        element.all(by.xpath(`//table[@ng-model="selected"]/tbody/tr[td//text()[contains(., "${shipmentTo}")]]/td[10]/a`)).first();

    private async selectAction(shipment: Shipment, action: string): Promise<EF>{
        let row = await this.getRow(shipment);
        await waitClick(await row.element(by.binding("text")));
        await waitClick(await this.action(action));
    }

    private async getRow(shipment: Shipment): Promise<EF> {
        let results: Array<EF> = await this.shipmentRows.asElementFinders_();
        for(let ele of results) {
            let binding = ele.element(by.binding("shipment.shipment_id"));
            let bindingText = await waitText(binding);
            if(bindingText.indexOf("" + await shipment.id) !== -1) {
                return ele;
            }
        }
        throw Error("SHIPMENT_DOES_NOT_EXIST_ERROR (shipment.page.ts:getRow(Shipment)");
    }

    async getShipmentRowCount() {
        return await this.shipmentRows.count();
    }

    async receiveShipmentFor(shipmentTo: string) {
        await this.shipmentActions(shipmentTo).click();
        await waitClick(this.receiveShipmentButton);
    }

    async cancelShipmentFor(shipmentTo: string) {
        await this.shipmentActions(shipmentTo).click();
        await waitClick(this.cancelShipmentButton);
    }

    async dispatchShipment(name: string, shipments: Shipments) {
        let s: Shipment = await shipments.getWithName(name);
        await this.selectAction(s, "Dispatch Shipment");
        await waitClick(dispatchPage.dispatchShipmentButton);
        await waitClick(dispatchPage.backToShipmentsButton);
    }

    async getStatus(name: string, shipments: Shipments) {
        let s: Shipment = await shipments.getWithName(name);
        let row: EF = await this.getRow(s);
        return await waitText(row.element(by.binding("shipment.shipment_status")));
    }

    async selectShipmentAction(shipment: string, action: string ){
        let shipmentRow = await this.tableBodyRow(shipment);
        await waitClick(shipmentRow.all(by.css('td')).last());
        await waitClick(this.buttonIdentifier(action));
    }

    rowByNumber = (rowNumber: number): EF => {
        return this.allRows.get(rowNumber);
    }

    checkBoxByText: EFStrFunc = (text:string) => element(by.xpath("//*[contains(text(),'"+text+"')][ancestor::md-checkbox]"));


    getRowCount() {
        return this.allRows.count();
    }

    private async getBulkStatusInput(row: EF, status: string): Promise<EF> {
        let statuses = ['intact', 'damaged', 'lost'];
        if ( status === "Temp excursion") return row.all(by.name("input")).get(0);

        for(let i in statuses) {
            if(statuses[i] === status) {
                return row.all(by.name("input")).get(Number(i));
            }
        }
        throw Error("could not find Bulk supply input element for status " + status);
    }

    async getBulkRow(name: string): Promise<EF> {
        let rows: EAF = this.allBulkRows;
        let count: number = await rows.count();
        let text: string;
        for(let i = 0; i < count; i++) {
            let row: EF = rows.get(Number(i));
            let element: EF = row.all(by.css("td")).first();
            await element.isDisplayed();
            text = await waitText(element);
            if(text.indexOf(name) !== -1) {
                return row;
            }
        }
        throw Error("Could not find element in getBulkRow:name: " + name);
    }

    // high-level functions
    async markKits(intact: number, damaged: number, lost: number) {
        let count = await this.allRows.count();
        for(let i = 0; i < count; i++) {
            let row = this.rowByNumber(Number(i));
            if(intact > 0) {
                await waitClick(await row.element(this.intactCheckboxLocator));
                intact--;
            } else if(damaged > 0) {
                await waitClick(await row.element(this.damagedCheckboxLocator));
                damaged--;
            } else if(lost > 0) {
                await waitClick(await row.element(this.lostCheckboxLocator));
                lost--;
            }
        }
    }

    async markBulkKit(name: string, quantity: number, status: string): Promise<void> {
        let row: EF = await this.getBulkRow(name);
        let input: EF = await this.getBulkStatusInput(row, status);
        await waitClick(input);
        await input.sendKeys(quantity);
    }

    async markAllBulkKits(table: TableDefinition): Promise<void> {

        for(let entry of table.hashes()){
            if(entry['Temp excursion'] !== undefined) await this.markBulkKit(entry['bulk supply'], Number(entry['Temp excursion']), 'Temp excursion');
            if(entry['intact'] !== undefined) await this.markBulkKit(entry['bulk supply'], Number(entry['intact']), 'intact');
            if(entry['damaged'] !== undefined)await this.markBulkKit(entry['bulk supply'], Number(entry['damaged']), 'damaged');
            if(entry['lost'] !== undefined)await this.markBulkKit(entry['bulk supply'], Number(entry['lost']), 'lost');
        }
    }

    async selectAllCheckBoxs(checkbox: string):Promise<void> {
        let enabled:boolean;
        do{
            enabled = await this.nextArrowButtons.first().isEnabled();
            await waitClick(this.checkBoxByText(checkbox));
            if(!enabled) break;
            await waitClick(this.nextArrowButtons.first());
        }
        while(enabled);
    }

}