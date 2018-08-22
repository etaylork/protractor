import { api, browser, expect, logger, waitClick, waitClickable, waitText, waitVisible, utils, TableDefinition } from '../../../utils';
import { TableValidation } from '../../../pages/other/validation';

import { ShipmentPage, ShipmentReviewPage, CreateShipmentPage  } from '../../../pages/supply';

const testData = require('../data/shipments.data.json');

const shipmentPage: ShipmentPage = new ShipmentPage();
const shipmentReviewPage: ShipmentReviewPage = new ShipmentReviewPage();
const createShipmentPage: CreateShipmentPage = new CreateShipmentPage();

const { When, Then } = require('cucumber');

When(/^I receive shipment '(.*?)'$/,
    async (shipment: string) => {
        await shipmentPage.receiveShipmentFor(shipment);
    });

Then(/^there are (\d+) available kits$/,
    async (kits: number) => {
        expect(await shipmentReviewPage.availableKitCount()).to.equal(Number(kits));
    });

Then(/^there are (\d+) damaged kits$/,
    async (kits: number) => {
        expect(await shipmentReviewPage.damagedKitCount()).to.equal(Number(kits));
    });

Then(/^there are (\d+) lost kits$/,
    async (kits: number) => {
        expect(await shipmentReviewPage.lostKitCount()).to.equal(Number(kits));
    });

When(/^I receive the shipment$/,
    async () => {
        await waitClick(shipmentReviewPage.receiveShipmentButton);
    });

Then(/^the shipment is successfully received$/,
    async () => {
        expect(await shipmentReviewPage.getShipmentConfirmationText()).to.contain('Shipment has been placed into Received status');
        await shipmentReviewPage.clickBackButton();
    });

When(/^I create a '(site|depot)' shipment$/,
    async (shipmentType: string) => {
        if(shipmentType === 'site') {
            await waitClick(shipmentPage.createSiteShipmentButton);
        } else if(shipmentType === 'depot') {
            await waitClick(shipmentPage.createDepotShipmentButton);
        } else {
            throw Error(shipmentType + " is not a valid shipment type. Must use 'site' or 'depot'.");
        }
    });

Then(/^I see all the required create-a-shipment fields$/,
    async () => {
        expect(await (await createShipmentPage.getColumnTitleElement("Study")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Country")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Site ID")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Investigator")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Address")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("LT (days)")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.sourceDropdown).isDisplayed()).to.be.true;
    });

Then(/^I see all the required create-depot-shipment fields$/,
    async () => {
        expect(await (await createShipmentPage.getColumnTitleElement("Study")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Country")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Depot ID")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Depot Name")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Address")).isDisplayed()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("LT (days)")).isDisplayed()).to.be.true;
    });

When(/^I filter shipments by '(Country|Site ID|Investigator|Depot ID)' equal to '(.*?)'$/,
    async(filterType: string, filterValue: string) => {
        let inputField = await createShipmentPage.getInputField(filterType);
        await waitClickable(inputField);
        await inputField.clear();
        await inputField.sendKeys(filterValue);
    });

Then(/^shipment '(?:Country|Site ID|Investigator|Depot ID)' equal to '(.*?)' is displayed$/,
    async (value: string) => {
        expect(await (await createShipmentPage.elementWithValue(value)).isDisplayed()).to.be.true;
    });

Then(/^shipment '(?:Country|Site ID|Investigator|Depot ID)' equal to '(.*?)' is not displayed$/,
    async (value: string) => {
        expect(await browser.isElementPresent(await createShipmentPage.elementWithValue(value))).to.be.false;
    });

When(/^I select site shipment '(.*?)' and source '(.*?)'$/,
    async (shipment: string, source: string) => {
        await createShipmentPage.clearAllFields(['Country', 'Site ID', 'Investigator']);
        await createShipmentPage.selectShipmentAndSourceG(shipment, source);
    });

When(/^I select depot shipment '(.*?)' and source '(.*?)'$/,
    async (shipment: string, source: string) => {
        await createShipmentPage.clearAllFields(['Country', 'Depot ID', 'Depot Name']);
        await createShipmentPage.selectShipmentAndSourceG(shipment, source);
    });

Then(/^I see all the required create-a-shipment inventory fields$/,
    async () => {
        expect(await (await createShipmentPage.getColumnTitleElement("Kit")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Lot")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Expiration date")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Available")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Available to ship")).isPresent()).to.be.true;
        //Tests for quantity row which has no header
        expect(await (await createShipmentPage.getContentInputField(1)).isPresent()).to.be.true;
    });

Then(/^I see all the required create-depot-shipment inventory fields$/,
    async () => {
        expect(await (await createShipmentPage.getColumnTitleElement("Kit")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Available")).isPresent()).to.be.true;
        expect(await (await createShipmentPage.getColumnTitleElement("Available to ship")).isPresent()).to.be.true;
        //Tests for quantity row which has no header
        expect(await (await createShipmentPage.getContentInputField(1)).isPresent()).to.be.true;
    });

When(/^I set quantity for '(.*?)', '(.*?)' equal to '(\d+)'$/,
    async (kit:string, lot: string, quantity:number) => {
        await createShipmentPage.setInventoryQuantity(kit, lot, quantity);
    });

Then(/^I see 'quantity too large' error message$/,
    async () => {
        logger.debug("'Quantity too large' error message currently inop, see issue PRANCER-3198");
    });

When(/^I submit the shipment$/,
    async () => {
        await waitClick(createShipmentPage.nextButton);
    });

Then(/^create site shipment review page '(source|destination)' is '(.*?)'$/,
    async (option: string, value: string) => {
        await waitVisible(createShipmentPage.reviewMessage);
        if(option === 'source') {
            expect(await createShipmentPage.reviewSourceElement.getAttribute("innerText")).to.contain(value);
        } else {
            expect(await createShipmentPage.reviewDestinationElement.getAttribute("innerText")).to.contain(value);
        }
    });

Then(/^create site shipment review page '(.*?)' '(kit|quantity|lot|expiration)' is '(.*?)'$/,
    async (kit: string, field: string, value: number) => {
        let kitFieldElement = await createShipmentPage.getKitFieldElement(kit, field);
        waitVisible(kitFieldElement);
        expect(await waitText(kitFieldElement)).to.equal(value);
    });

Then(/^shipment id is verified on shipment reports list$/,
    async() => {
        await logger.debug("Shipment ids are not currently showing up on shipment reports list in Jenkins");
    });

When(/^I have created all required shipments$/,
    async(table: TableDefinition) => {
        this.shipments = await createShipmentPage.createSiteShipments(table);
        await utils.screenshot("all-shipments-created.png");
    });

When(/^I (dispatch|cancel) shipment '(.*?)'$/,
    async(type: string, name: string) => {
        if(type.indexOf('dispatch') !== -1) {
            await shipmentPage.dispatchShipment(name, this.shipments);
        } else {
            await shipmentPage.cancelShipmentFor(name);
            await waitClick(shipmentPage.cancelShipmentButton);
            await utils.screenshot('cancelled-shipment-done-page.png');
            await waitClick(shipmentPage.backToShipmentsButton);
        }
    });

When(/^I cancel the last shipment created$/,
    async function(){
        let shipmentData = await api.post('test_api/lastshipmentview', '{"shipment":"last shipment"}');
        await shipmentPage.cancelShipmentFor(shipmentData.shipment_id);
        await waitClick(shipmentPage.cancelShipmentButton);
        await utils.screenshot('cancelled-shipment-done-page.png');
        await waitClick(shipmentPage.backToShipmentsButton);
    });

Then(/^shipment '(.*?)' status is '(.*?)'$/,
    async(name: string, status: string) => {
        expect(await shipmentPage.getStatus(name, this.shipments)).to.equal(status);
    });

When(/^'(.*?)' has available quantity(?: (\d+))?$/,
    async function (source: string, quantity: number) {
        expect(await this.page.sourceDropdown.getText()).to.contain(source);
        if(quantity) {
            expect(await this.page.hasAvailableQuantity(this.page.availableRow, quantity)).to.be.true;
            expect(await this.page.hasAvailableQuantity(this.page.availableToShipRow, quantity)).to.be.true;
            await utils.screenshot(source+"-has-available-quantity-"+quantity+".png");
        } else {
            expect(await this.page.hasAvailableQuantity(this.page.availableRow)).to.be.true;
            expect(await this.page.hasAvailableQuantity(this.page.availableToShipRow)).to.be.true;
            await utils.screenshot(source+"-has-available-quantity.png");
        }
    });

When(/^each kit has suggested quantity$/,
    async function () {
        expect(await this.page.hasSuggestedQuantity()).to.be.true;
    });

When(/^shipment is cancelled$/,
    async function () {
        await waitClick(this.page.cancelButton);
    });

Then(/^warning message is present$/,
    async function () {
        expect(await this.page.itmesNotIncludedWarning.isPresent()).to.be.true;
    });

Then(/^shipments display correctly - '(.*?)'$/,
    async function (key: string) {
        await TableValidation.containsData(shipmentPage.tbody, testData[key]);
    });

Then(/^shipments page contains (\d+) shipments$/,
    async function (numShipments: number) {
        expect(await shipmentPage.shipmentRows.count()).to.equal(numShipments);
    });

When(/^I set the quantity for all kit types to '(.*?)'$/,
    async function(quantity: string){
        await createShipmentPage.addQuantityToAllKits(quantity);
    });

When(/^I select action '(.*?)' for shipment with id '(.*?)'$/,
        async function(action: string, shipment: string){
           await shipmentPage.selectShipmentAction(shipment, action);
    });

Then(/^no shipments are displayed on the shipment page$/,
    async function(){
        expect(await shipmentPage.table.isPresent()).to.be.false;
        expect(await waitText(shipmentPage.noShipmentsMessage)).to.equal("There are no shipments available to show at this time");
});

Then(/^the shipment request has '(.*?)' preset as the destination$/,
    async function(depot: string){
        expect(await waitText(shipmentPage.checkBoxRow)).to.contain(depot);
    });

Then(/^the source of the shipment is preset to '(.*?)'$/,
    async function(depot:string){
        expect(await waitText(shipmentPage.sourceField)).to.contain(depot);
    });

When(/^I ship out bulk kits for the shipment(?:s)$/,
    async function(table: TableDefinition){
        await createShipmentPage.shipBulkKits(table);
    });

When(/^I confirm creation of sublots$/,
    async function(){
        await createShipmentPage.confirmSubLot('yes');
    });

When(/^I select action '(.*?)' for the last shipment created$/,
    async function(action: string){
        let shipmentData = await api.post('test_api/lastshipmentview', '{"shipment":"last shipment"}');
        await shipmentPage.selectShipmentAction(shipmentData.shipment_id, action);
    });

Then(/^'(\d+)' order requests are displayed$/,
    async function(shipments: number, table: TableDefinition){
        let date = new Date();
        let month: string = Number(date.getMonth()) < 10 ? '0'+(date.getMonth()+1) : '' + date.getMonth()+1;
        let currentDate = date.getFullYear() + '-' + month + '-' + date.getDate();

        expect(await shipmentPage.tableBodyRows.count()).to.equal(shipments);
        for(let entry of table.hashes()){
            entry['Requested on'] = currentDate;
            expect(await TableValidation.containsEntries(entry)).to.be.true;
        }
    });

Then(/^the shipment is displayed on the current shipments list$/,
        async function(){
            let shipmentData = await api.post('test_api/lastshipmentview', '{"shipment":"last shipment"}');
            expect(await shipmentPage.linkIdentifier(shipmentData.shipment_id).isDisplayed()).to.be.true;
            await utils.screenshot('shipment-created.png');
    });

When(/^I click the unblind receive a shipment button$/,
    async function(){
        await waitClick(shipmentPage.unblindReceiveShipmentButton);
    });

When(/^I mark all discrete and bulk supply as '(.*?)'$/,
    async function(checkbox: string, table: TableDefinition){
        await shipmentPage.selectAllCheckBoxs(checkbox);
        await shipmentPage.markAllBulkKits(table);
    });
