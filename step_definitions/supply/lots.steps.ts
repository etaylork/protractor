import { waitClick, browser, expect, utils, waitText } from '../../utils';
import { TableDefinition } from 'cucumber';
import { logger } from '../../utils/logger';

import { API } from '../../utils/api';
import { LotsPage } from '../../pages/supply/lots/lots.page';
import { Sidebar } from '../../pages/other/sidebar/sidebar.page';

const { When, Then } = require("cucumber");

const api: API = new API();
const sidebar: Sidebar = new Sidebar()
const lotsPage: LotsPage = new LotsPage();

When(/^I create lots$/, { timeout: 180 * 1000 },
    async function (table: TableDefinition) {
        let lots = await utils.tableToJson(table);
        for(let lot in lots) {
            let singleLot = lots[lot];
            singleLot["user"] = this.user.email;
            singleLot["password"] = this.user.password;
            await lotsPage.createLot(singleLot);
        }
    });

When(/^I update the expiration date for the lot containing kit '(.*?)'$/,
    async function (kit: number) {
        let url = await browser.getCurrentUrl();
        if (url.indexOf('lots') == -1) {
            await sidebar.openLotsPage();
        }
        let date = utils.getCurrentDate();
        this.kit = kit;
        this.date = date;
        await lotsPage.filterKits(this.kitType);
        await lotsPage.selectAction('update expiration date');
        expect(await lotsPage.updateExpirationDate(date)).to.be.true;
        await waitClick(lotsPage.nextButton);
        expect(await lotsPage.authenticateAction(this.user.email, this.user.password)).to.be.true;
        await waitClick(lotsPage.updateExpirationDateButton2);
    })

When(/^I quarantine the lot containing kit '(.*?)'$/,
    async function (kit: number) {
        let url = await browser.getCurrentUrl();
        if (url.indexOf('lots') == -1) {
            await sidebar.openLotsPage();
        }

        this.kit = kit
        await lotsPage.filterKits(this.kitType);
        await lotsPage.selectAction('quarantine');
        expect(await lotsPage.authenticateAction(this.user.email, this.user.password)).to.be.true;
        await waitClick(lotsPage.quarantineButton);
        await utils.screenshot("Quarantined.png")
    });

When(/^I release the lot from quarantine$/,
    async function () {
        let url = await browser.getCurrentUrl();
        if (url.indexOf('lots') == -1) {
            await sidebar.openLotsPage();
        }

        await lotsPage.filterKits(this.kitType);
        await lotsPage.selectAction('release from quarantine');
        expect(await lotsPage.authenticateAction(this.user.email, this.user.password)).to.be.true;
        await waitClick(lotsPage.releaseButton);
    });

When(/^'(.*?)' lot expiry is set to (\d+) days$/,
    async function (lot: string, days: number) {
        logger.debug("lots.steps: When " + lot + " expiry is set to " + days + " days");

        let query = {
            'query': 'set-lot-expiry',
            'study': this.study,
            'lot': lot,
            'days': days
        }
        let result = await api.post('test_api/lots', JSON.stringify(query));
        expect(result['result']).to.equal('success');
    });

When(/^record is added for '(.*?)', '(.*?)' and DNS (\d+)$/,
    async function (depot: string, lot: string, dns: number) {
        logger.debug("lots.steps: When record is added for '" + depot + "', '" + lot + "' and DNS " + dns);

        let query = {
            'query': 'add-lot-depot-record',
            'depot': depot,
            'lot': lot,
            'dns': dns
        }
        let result = await api.post('test_api/lots', JSON.stringify(query));
        expect(result['result']).to.equal('success');
    });

When(/^I select action '(.*?)' for lot '(.*?)'$/,
    async function(action: string, link: string){
       await lotsPage.selectLotAction(action, link);
    });

When(/^I create a sub lot for lot '(.*?)'$/,
    async function(link: string, table: TableDefinition){
        let lots = await utils.tableToJson(table);
        await lotsPage.selectLotAction('Create sub-lot', link);
        await lotsPage.createSubLot(lots[0], link);
    });

Then(/^verify the options in the lots location drop down is displayed$/,
    async function(table: TableDefinition){
        await waitText(lotsPage.locationField);
        let depotOptions = await lotsPage.getLocationOptions();
        for(let entry of table.hashes()){
            expect(depotOptions.indexOf(entry.options) !== -1).to.be.true;
        }
    }); 

Then(/^(?:sub lot|lot) '(.*?)' is displayed on the lots page$/,
    async function(lot: string){
        await expect(await lotsPage.linkIdentifier(lot).isDisplayed()).to.be.true;
        await utils.screenshot(lot+'-displayed.png');
    })

Then(/^the sublots created by the depot shipment are displayed$/,
    async function(table:TableDefinition){
        for(let entry of table.hashes()){
            expect(await lotsPage.linkIdentifier(entry.sublots).isDisplayed()).to.be.true;
        }
    });
