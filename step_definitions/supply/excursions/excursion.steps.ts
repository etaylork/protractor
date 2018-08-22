import { browser, expect, logger, waitClick, waitText, utils, TableDefinition, sidebar } from '../../../utils';
import { ExcursionPage } from '../../../pages/supply';
import { DepotExcursionPage } from '../../../pages/supply/excursions/depot-excursion.page';
const { When, Then } = require("cucumber");

const excursionPage: ExcursionPage = new ExcursionPage();
const depotExcursionPage: DepotExcursionPage = new DepotExcursionPage();

When(/^I mark '(\d+)' discrete supply as '(.*?)' for inventory with temp excursion process$/,
    async function(numberOfKits: number, status: string){
        await depotExcursionPage.markDiscreteSupply(numberOfKits, status);
    });

When(/^I mark bulk kits for inventory with temp excursion process$/,
    async function(table: TableDefinition){
        for(let entry of table.hashes()){
            await depotExcursionPage.markBulkSupply(entry['kit'], entry['status'], entry['quantity']);
        }
    });

Then(/^a total of '(\d+)' excursions are displayed$/,
    async function(excursions: number){
        await expect(await excursionPage.tableBodyRows.count()).to.equal(excursions);
        await utils.screenshot('excursion-management-table.png');
    });

When(/^I progress excursion '(.*?)' marking all kits as '(.*?)'$/,
    async function(excursion: number, status: string){
        let currentUrl = await browser.getCurrentUrl();
        if( currentUrl.indexOf('supply/excursions') === -1) await sidebar.openExcursionPage();

        //noting down temperature details first
        this.tempDetailsExcursionPage = await excursionPage.getTempDetails(String(excursion));

        await excursionPage.selectProgressLink(excursion);
        await waitClick(excursionPage.selectAllRadioButton(status));
        await excursionPage.markAllBulkSupply(status);
        await waitClick(excursionPage.nextButton);
        await waitClick(excursionPage.reviewPageNextButton);
        
    });

When(/^I partially progress excursion '(\d+)' as '(.*?)'$/,
    async function(excursion: number, status: string ){
        let currentUrl = await browser.getCurrentUrl();
        if( currentUrl.indexOf('supply/excursions') === -1) await sidebar.openExcursionPage();

        await excursionPage.selectProgressLink(excursion);
        await excursionPage.partiallyMarkDiscreteKits(status);
        await excursionPage.partiallyMarkBulkKits(status);
        await waitClick(excursionPage.nextButton);
        await waitClick(excursionPage.reviewPageNextButton);
    });

When(/^I enter the temperature details on the inventory with temp excursion page$/,
    async function(table: TableDefinition){
        for( let entry of table.hashes()){
            await depotExcursionPage.enterTempDetail('Maximum temperature', entry['max temp']);
            await depotExcursionPage.enterTempDetail('Minimum temperature', entry['min temp']);
            await depotExcursionPage.enterTempDetail('Duration above allowed temp', entry['above allowed temp']);
            await depotExcursionPage.enterTempDetail('Duration below allowed temp', entry['below allowed temp']);  
            await depotExcursionPage.enterDateExcursionStarted(entry['Date excursion started']); 
            await depotExcursionPage.enterDateExcursionEnded(entry['Date excursion ended']); 
        }
    });

When(/^I show all the excursions$/,
    async function(){
        await waitClick(excursionPage.showAllCheckBox);
    });

When(/^I progress excursion '(\d+)'$/,
    async function(excursion: number){
        let currentUrl = await browser.getCurrentUrl();
        if( currentUrl.indexOf('supply/excursions') === -1) sidebar.openExcursionPage();

        await excursionPage.selectProgressLink(excursion);
    });

/* depot excurions step definitions */
When(/^I select depot '(.*?)' on the depot excursion page$/,
    async function(depot: string){
        await depotExcursionPage.selectDepot(depot);
    });

When(/^I create a temp excursion for depot '(.*?)'$/,
    async function (depot: string) {
        let currentDate = utils.getCurrentDate();
        await depotExcursionPage.selectDepot(depot);
        await waitClick(depotExcursionPage.tempExcursionCheckBox);
        await waitClick(depotExcursionPage.statusSelectionNextButton);
        await depotExcursionPage.enterStartDateAndTime(currentDate, "5", "20");
        await depotExcursionPage.enterEndDate(currentDate);
        await waitClick(depotExcursionPage.enterDetailsNextButton);
        await waitClick(depotExcursionPage.reviewNextButton);
    });

Then(/^the temperature exursion details for excursion '(.*?)' is displayed$/,
    async function (excursion: string){
        logger.debug('validating excursions for excursion' + excursion);
        let temperatureDetails = await waitText(excursionPage.donePageTempDetails);
        for(let i in this.tempDetailsExcursionPage){
            expect(temperatureDetails).to.contain(this.tempDetailsExcursionPage[i]);
        }

        await utils.screenshot('temperature-details.png');
    });

When(/^I progress with completing inventory with temp excursions process$/,
    async function(){
        if( (await depotExcursionPage.depotExcursionSteps()) >= 4) {
            await waitClick(depotExcursionPage.nextButtons.get(1));
            await waitClick(depotExcursionPage.nextButtons.get(2));
            return;
        } else {
            await waitClick(depotExcursionPage.nextButtons.get(0));
            await waitClick(depotExcursionPage.nextButtons.get(2));
        }
    });