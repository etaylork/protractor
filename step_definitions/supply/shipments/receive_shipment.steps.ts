
import { api, browser, expect, waitClick, waitClickable, waitText, waitVisible, utils, TableDefinition } from '../../../utils';
import { ShipmentPage, ReceiveShipmentPage } from '../../../pages/supply';
import { TableValidation } from '../../../pages/other/validation';
import { listOf } from '../../../utils/text';

const receiveShipmentPage: ReceiveShipmentPage = new ReceiveShipmentPage();
const shipmentPage: ShipmentPage = new ShipmentPage();

const { When, Then } = require('cucumber');


When(/^I fully receive shipment '(.*?)'$/,
    async (shipment: string) => {
        await shipmentPage.receiveShipmentFor(shipment);
        await receiveShipmentPage.markAllIntact();
        await waitClick(receiveShipmentPage.nextButton);
        await waitClick(receiveShipmentPage.receiveShipmentButton);
        await waitClick(receiveShipmentPage.finishButton);
    });

When(/^I select the intact checkbox$/,
    async () => {
        await receiveShipmentPage.markAllIntact();
        var rowCount = await receiveShipmentPage.getRowCount();
        for (let rowNumber = 0; rowNumber < rowCount; rowNumber++) {
            expect(await receiveShipmentPage.getKitStatusByRowNumber(rowNumber)).to.equal('Intact');
        }
    });

    When(/^(.*?) are intact$/,
    async (kitIds: string) => {
        for (let kitId of listOf(kitIds)) {
            await receiveShipmentPage.markAsIntact(kitId);
            expect(await receiveShipmentPage.getKitStatusByKitId(kitId)).to.equal('Intact');
        }
    });

When(/^(.*?) are damaged$/,
    async (kitIds: string) => {
        for (let kitId of listOf(kitIds)) {
            await receiveShipmentPage.markAsDamaged(kitId);
            expect(await receiveShipmentPage.getKitStatusByKitId(kitId)).to.equal('Damaged');
        }
    });

When(/^(.*?) are lost$/,
    async (kitIds: string) => {
        for (let kitId of listOf(kitIds)) {
            await receiveShipmentPage.markAsLost(kitId);
            expect(await receiveShipmentPage.getKitStatusByKitId(kitId)).to.equal('Lost');
        }
    });


When(/^I process the shipment$/,
    async () => {
        await waitClick(receiveShipmentPage.nextButton);
    });

When(/^(\d+) is damaged, (\d+) is lost, and (\d+) is intact$/,
    async(damaged: number, lost: number, intact: number) => {
        await receiveShipmentPage.markKits(intact, damaged, lost);
    });

When(/^bulk '(.*?)' has (\d+) '(.*?)'$/,
    async(name: string, quantity: number, status: string) => {
        await receiveShipmentPage.markBulkKit(name, quantity, status);
    });

When(/^mark the bulk supply as:$/,
    async function(table: TableDefinition){
        await receiveShipmentPage.markAllBulkKits(table);
    }); 

When(/^I indicate that there is a temp excursion$/,
    async function(){
        await waitClick(receiveShipmentPage.confirmTempExcursionCheckBox);
    });

Then(/^the discrete kits are displayed in descending order on the receive shipment review page$/,
    async function(){
        expect(await TableValidation.validateColumnDataDESC(receiveShipmentPage.reviewPageKitRows, 0)).to.be.true;
        await utils.screenshot('kits-displayed-descending-order.png');
    });

When(/^I continue with creating a shipment$/,
    async function(){
        await waitClick(receiveShipmentPage.buttonIdentifier('Next'));
        await waitClick(receiveShipmentPage.buttonIdentifier('CREATE SHIPMENT'));
    });

When(/^I enter the temperature details$/,
    async function(table: TableDefinition){
        for( let entry of table.hashes()){
            await receiveShipmentPage.enterTempMonitorID(entry['Temp ID']);
            await receiveShipmentPage.enterTempDetail('Maximum temperature', entry['max temp']);
            await receiveShipmentPage.enterTempDetail('Minimum temperature', entry['min temp']);
            await receiveShipmentPage.enterTempDetail('Duration above allowed temp', entry['above allowed temp']);
            await receiveShipmentPage.enterTempDetail('Duration below allowed temp', entry['below allowed temp']);   
        }
    });

When(/^I click the temperature details page next button$/,
    async function(){
        await waitClick(receiveShipmentPage.reviewPageNextButton);
    })
    