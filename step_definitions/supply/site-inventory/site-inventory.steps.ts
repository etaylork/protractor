import { expect, utils, TableDefinition, waitClick, waitText } from '../../../utils';
import { SiteInventoryPage } from '../../../pages/supply';
import { TableValidation } from '../../../pages/other/validation';

const { Then, When } = require('cucumber');

const siteInventoryPage: SiteInventoryPage = new SiteInventoryPage();


When(/^I mark the following discrete kits as$/,
    async function(table: TableDefinition){
        for(let entry of table.hashes()){
            await siteInventoryPage.markDiscreteKits(entry['kit ID'], entry['status']);
        }
    });

When(/^I mark the following bulk kits as$/,
    async function(table:TableDefinition){
        for(let entry of table.hashes()){
            let keys = Object.keys(entry)
            for(let i = 1; i < keys.length; i++){
               await siteInventoryPage.markBulkKits(entry[keys[0]], keys[i], entry[keys[i]]);
            }
        }
    });

When(/^I update all the site inventory as '(.*?)'$/,
    async function(status: string, table: TableDefinition){
        await siteInventoryPage.markAllDiscreteKits(status);
        for(let entry of table.hashes()){
            let keys = Object.keys(entry)
            for(let i = 1; i < keys.length; i++){
               await siteInventoryPage.markBulkKits(entry[keys[0]], keys[i], entry[keys[i]]);
            }
        }
        await waitClick(siteInventoryPage.nextButton);
        await waitClick(siteInventoryPage.reviewPageNextButton);
        await waitClick(siteInventoryPage.buttonIdentifier('Back to Inventory'));
    });

When(/^continue with updating the site inventory$/,
    async function(){
        await waitClick(siteInventoryPage.nextButton);
        await waitClick(siteInventoryPage.reviewPageNextButton);
    });

When(/^I mark all discrete kits on the page as '(.*?)'$/,
    async function(status: string){
        await waitClick(siteInventoryPage.discreteTableHeaderCheckbox(status));
    });

When(/^I mark the '(.*?)' bulk kit(?:s) as '(.*?)'$/,
    async function(oldStatus: string, newStatus: string, table: TableDefinition){
        for(let entry of table.hashes()){
            await siteInventoryPage.changeBulkKitStatuses(oldStatus, newStatus, entry['kit type']);
        }
    });

When(/^I mark all discrete kits as '(.*?)'$/,
    async function(status: string){
        await siteInventoryPage.markAllDiscreteKits(status);
    });

Then(/^the following status columns are displayed on the page/,
    async function(table: TableDefinition){
        let data: {} = utils.tableToJsonStrObj(table);
        expect(await TableValidation.containsColumns(siteInventoryPage.table, data['columns'])).to.be.true;
    });

Then(/^the site inventory updated successfully$/,
    async function(){
        expect(await waitText(siteInventoryPage.resultMessage)).to.contain('Inventory status has been updated successfully');
        utils.screenshot('site-inventory-successfully-update.png');
    });

Then(/^discrete kit (.*?) is not visible$/,
    async function(kit: string){
        expect((await utils.status(siteInventoryPage.cellData(kit))).displayed).to.be.false;
        await utils.screenshot(kit+'-not-visible.png');
    });

Then(/^kit '(.*?)' is visible in '(.*?)' status$/, 
    async function(kit: string, status: string){    
        expect(await siteInventoryPage.verifyMarkedDiscreteKit(kit, status)).to.equal('true');
        await utils.screenshot(kit+'-visible-in-'+status+'-status.png');
    });

Then(/^there is no inventory on the site inventory page$/,
    async function(){
        expect(await siteInventoryPage.verifyInventoryDisplayed()).to.be.false
        await utils.screenshot('site-inventory-page-no-inventory.png');
    });

Then(/^there is inventory displayed with the following status columns on the site inventory page$/,
    async function(table: TableDefinition){
        let data: {} = utils.tableToJsonStrObj(table);
        expect(await siteInventoryPage.verifyInventoryDisplayed()).to.be.true;
        expect(await TableValidation.containsColumns(siteInventoryPage.table, data['columns'])).to.be.true;
        await utils.screenshot('site-inventory-page-displayed.png');
    });