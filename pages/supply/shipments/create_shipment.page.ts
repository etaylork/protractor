import { by, browser, element, EF, EAF, logger, waitClick, waitClickable, waitText, waitVisible, utils } from '../../../utils';
import { TableDefinition } from 'cucumber';

import { ShipmentPage } from './shipment.page';
import { Shipments, Shipment } from './support/shipment';
import { Sidebar } from '../../other/sidebar/sidebar.page';
import { TableValidation } from '../../other/validation/table/table-validation.page';
import { EFStrFunc } from '../../home/report/pages/report.page';

const sidebar: Sidebar = new Sidebar();

export class CreateShipmentPage extends ShipmentPage {

    private kitsToShipRow = 5;

    backToShipmentsButton: EF = element(by.id("back_to_shipments_btn"));
    createShipmentButton: EF = element(by.id("create_shipment_btn"));
    sourceDropdown: EF = element(by.xpath("//md-select[@name='source']"));
    nextButton: EF = element(by.id("create_shipment_next_btn"));
    reviewSourceElement: EF = element(by.xpath("(//div[contains(@label,'SHIPMENT_SOURCE')]//span[@e2e-id='strValue'])[1]"));
    reviewDestinationElement: EF = element(by.xpath("(//div[contains(@label,'SHIPMENT_DESTINATION')]//span[@e2e-id='strValue'])[1]"));
    reviewMessage: EF = element(by.id("shipment_details_review"));
    shipmentContentSection: EF = element(by.id("shipment_content"));
    contentRows: EAF = this.shipmentContentSection.all(by.xpath("..//table//tbody//tr"));
    itmesNotIncludedWarning: EF = element(by.cssContainingText("i + span","Some items"));
    kitsToShipField: EAF = element.all(by.model('kit.quantity'));
    confirmSubLotField: EF = element(by.model('model.createSublot'));
    optionWithText: EFStrFunc = (option: string) => element.all(by.xpath('//text()[contains(.,"'+option+'")]/ancestor::md-option')).last();

    async open() {
        await sidebar.openShipmentsPage();
        await waitClick(this.createDepotShipmentButton);
        return new CreateShipmentPage();
    }

    async isCurrentPage() {
        let url = await browser.getCurrentUrl();
        let resultA = url.indexOf("shipment") !== -1;
        let resultB = url.indexOf("type=depot") !== -1;
        return resultA && resultB;
    }

    // Low-level functions
    async getCheckbox(shipment:string) {
        return element(by.xpath("//*[@id='destination-" + shipment + "']//md-checkbox"));
    }

    /**
     * Returns the element that holds the header field text
     * @param elementName Any of the create shipment table header values
     */
    async getColumnTitleElement(elementName: string) {
        return await element(by.xpath("//thead/tr/th[text()='" + elementName + "']"));
    }

    /**
     * Returns the requested filtering input field
     * @param fieldType either Country, Site ID, or Investigator
     */
    async getInputField(fieldType:string) {
        return await element(by.xpath("//md-input-container[@path='" + this.translate(fieldType) + "']/input"));
    }

    /**
     * Gets element with <value> text from the body of the table
     * @param header not currently used, signifies column header
     * @param value The text value of the field
     */
    async elementWithValue(value:string) {
        return await element(by.xpath("//tbody//td[text()='" + value + "']"));
    }

    async getKitFieldElement(kit:string, field:string) {
        return await element.all(by.id(kit+"-"+field)).first();
    }

    async clearAllFields(list: string[]) {
        for(let column of list) {
            let inputField = await this.getInputField(column);
            await waitClickable(inputField);
            await inputField.clear();
        }
    }

    async getContentInputField(index:number) {
        return await element(by.xpath("(((//tbody)[2]/tr)["+index+"]/td)[6]"));
    }

    async setInventoryQuantity(kit:string, lot: string, quantity:number) {
        let inputField = await element.all(by.xpath("//*[contains(text(),'"+lot+"')]/..//*[contains(text(),'"+kit+"')]/..//input")).first();
        await inputField.clear();
        await inputField.sendKeys(quantity);
    }

    async getReviewKitField(kit:string, field:string) {
        return await element(by.xpath("(//tbody//tr[@autokit='" + kit + "'])[1]/td[@autoid='" + field + "']"));
    }

    async getShipmentId(): Promise<number> {
        let ele = element(by.xpath("//span[@e2e-id='message'][contains(text(),'Successfully created shipment')]"))
        await waitClickable(ele);
        let message: string; 
        try {
            message = await waitText(ele);
        } catch (e) {
            logger.debug(e.stack);
            message = await waitText(ele);
        }
        return Number(message.replace("Successfully created shipment ",""));
    }

    async hasNoQuantity(row: number): Promise<boolean> {
        let hasNoQuantity = async (strNum: string) => Number(strNum) === 0;
        let getText = async (ele: EF): Promise<string> => await ele.getText();

        return await TableValidation.validateColumn(this.contentRows, row, hasNoQuantity, getText);
    }

    async hasAvailableQuantity(row: number, quantity?: number): Promise<boolean> {
        let hasQuantity = quantity?
            async (strValue: string) => Number(strValue) === quantity:
            async (strValue: string) => Number(strValue) >= 1;
        let getText = async (ele: EF) => await ele.getText();

        return await TableValidation.validateColumn(this.contentRows, row, hasQuantity, getText);
    }

    async hasSuggestedQuantity(): Promise<boolean> {
        let hasQuantity = async (strValue: string) => Number(strValue) >= 1;
        let getInputValue = async (ele: EF) => await ele.element(by.css("input")).getAttribute('value');

        return await TableValidation.validateColumn(this.contentRows, this.kitsToShipRow, hasQuantity, getInputValue);
    }

    //High-level functions
    async createSiteShipments(table: TableDefinition): Promise<Shipments> {
        let shipments: Shipments = await Shipments.create(table);
        for(let shipment of shipments.list) {
            shipment.id = await this.createSiteShipment(shipment);
        }
        return shipments;
    }

    private async createSiteShipment(shipment: Shipment): Promise<number> {
        if (shipment.type.indexOf("site") !== -1)
            await waitClick(this.createSiteShipmentButton);
        else
            await waitClick(this.createDepotShipmentButton);
        await this.selectShipmentAndSourceG(shipment.destination, shipment.source);
        for(let kit of shipment.contents) {
            await this.setInventoryQuantity(kit.name, kit.lot, kit.quantity);
        }
        await this.nextButton.click();
        await waitClick(this.createShipmentButton);
        let shipmentId = await this.getShipmentId();
        await waitClick(this.backToShipmentsButton);
        return shipmentId;
    }

    async selectDestinationG(shipment:string):Promise<void> {
        await this.selectDestination(shipment);           //click destination -> selectDestination()
        let checkbox = await this.getCheckbox(shipment);
        while(!await checkbox.getAttribute("checked")) {  //while checkbox is unchecked
            await logger.debug("CreateShipmentPage: failed to click destination checkbox, trying again...");
            await utils.refresh();                           //refresh
            await this.selectDestination(shipment);          //click destination -> selectDestination()
        }
    }

    async openSourceDropdownG(shipment:string, source:string) {
        await this.selectDestinationG(shipment);      //selectDestinationG()
        await waitClick(this.sourceDropdown);   //click dropdown
        let option = await element(by.xpath("//md-option[@value='" + source + "']"));
        let optionIsVisible = false;
        do {
            try {
                await waitVisible(option, 5000);
                optionIsVisible = true;
            } catch (e) {
                await logger.debug("CreateShipmentPage: failed to click source dropdown, trying again...");
                await utils.refresh();
                await this.selectDestinationG(shipment);
                await waitClick(this.sourceDropdown);
            }
        } while(!optionIsVisible);
    }

    async selectShipmentAndSourceG(shipment:string, source:string) {
        await this.openSourceDropdownG(shipment, source);          //openSourceDropdownG
        let option = await element(by.xpath("//md-option[@value='" + source + "']"));
        await waitClick(option);         //click option
        let tableIsVisible = false;
        do {
            try {
                await waitVisible(this.shipmentContentSection);
                tableIsVisible = true;
            } catch(e) {
                await logger.info("Shipment Steps: failed to click source option, trying again...");
                await utils.refresh();
                await this.openSourceDropdownG(shipment, source);
                await waitClick(option);
            }
        } while(!tableIsVisible);
    }

    async selectDestination(shipment:string) {
        await waitClick(await this.elementWithValue(shipment));
    }

    async selectSource(source:string) {
        await waitClick(this.sourceDropdown);
        await logger.debug("clicked dropdown, waiting on option, "+"//md-option[@value='" + source + "']");
        let option = await element(by.xpath("//md-option[@value='" + source + "']"));
        await waitClick(option);
    }

    async selectShipmentAndSource(shipment:string, source:string) {
        let destination = await this.elementWithValue(shipment);
        await waitClick(destination);
        await this.selectSource(source);
    }

    private translate = (text: string) => {
        switch (text) {
            case 'Country': {
                return 'address.country';
            }
            case 'Site ID': {
                return 'study_site_code';
            }
            case 'Investigator': {
                return 'investigator_name';
            }
            case 'Depot ID': {
                return 'location_id';
            }
            case 'Depot Name': {
                return 'location_desc';
            }
            default: {
                throw Error("cannot translate value: " + text);
            }
        }
    }

    async addQuantityToAllKits(quantity: string){
        let count = await this.kitsToShipField.count();

        for(let i = 0; i < count; i++){
            let inputfield = await this.kitsToShipField.get(i).element(by.model('ngModel'));
            await inputfield.clear();
            await inputfield.sendKeys(quantity);
        }
    }

    async confirmSubLot(option: string){
        await waitClick(this.confirmSubLotField, 1500, this.optionWithText(option));
        await waitClick(this.optionWithText(option));
    }

    async shipBulkKits(table:TableDefinition){
        for(let entry of table.hashes()){
            let kitsToShipField =  (kit: string) => element(by.xpath("//td[contains(text(),'"+kit+"')]/ancestor::tr")).element(by.model("ngModel"));
            await kitsToShipField(entry.kit).clear();
            await kitsToShipField(entry.kit).sendKeys(entry.quantity);
        }
    }
}