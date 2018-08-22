
import { expect, TableDefinition, browser, waitClick, } from '../../utils';
import { OrderSupplyPage } from '../../pages/supply';

const orderSupplyPage: OrderSupplyPage = new OrderSupplyPage();

const { When, Then } = require('cucumber');

When(/^I press the order supply button$/,
    async function(){
        await waitClick(orderSupplyPage.orderSupplyButton);
    });

When(/^I add supply for (?:kit|kits) on the order supply page$/,
    async function(table: TableDefinition){
        let currentUrl = await browser.getCurrentUrl();
        expect(currentUrl).to.contain('siteorder');
        for(let entry of table.hashes()){
            await orderSupplyPage.enterKitQuantity(entry['kit'], entry['quantity']);
        }
    });

Then(/^kit '(.*?)' is not displayed in the table$/,
    async function(kit: string){
        expect(await orderSupplyPage.cellData(kit).isPresent()).to.be.false;
    });