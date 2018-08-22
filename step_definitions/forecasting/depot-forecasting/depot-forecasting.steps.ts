import { browser, ExpectedConditions, expect, logger, utils, waitClick } from '../../../utils';

import { DepotForecasting } from '../../../pages/forecasting/depot-forecasting/depot-forecasting.page';
import { Sidebar } from '../../../pages/other/sidebar/sidebar.page';
import { TableValidation } from '../../../pages/other/validation/table/table-validation.page'
import { API } from '../../../utils/api';

const { Given, When, Then } = require("cucumber");

const testData = require("./data/test-data-1.json");

const api: API = new API();
const depotForecasting: DepotForecasting = new DepotForecasting();
const sidebar: Sidebar = new Sidebar();

Then(/^validate upper page data(?: - '(.*?)')?$/,
    async (dataId) => {
        await browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(depotForecasting.forecastRunningMessage)));
        if(!dataId) {
            logger.debug("depot-forecasting.steps: Then validate upper page data");
            expect(await depotForecasting.depotDemandConfidenceKnob.isDisplayed()).to.be.true;
            expect(await TableValidation.containsColumns(depotForecasting.bufferLevelTable, testData["upper-columns"])).to.be.true;
            expect(await TableValidation.containsData(depotForecasting.bufferLevelTable, testData["upper-data"])).to.be.true;
            await utils.screenshot("validate-upper-page-data.png");
        } else {
            await logger.debug("depot-forecasting.steps: Then validate upper page data - " + dataId);
            expect(await TableValidation.containsData(depotForecasting.bufferLevelTable, testData[dataId])).to.be.true;
            await utils.screenshot("validate-upper-forecasting-data-"+dataId+".png");
        }
    });

Then(/^validate notches\/pg depot api data$/,
    async () => {
        logger.debug("depot-forecasting.steps: Then validate notches/pg depot api data");

        let query1 = {
            'query': 'longwindow-notch-depot-selected',
            'pooling-group': 'tc_resupply_study_1',
            'depot': 'USDEP1'
        };
        let response = await api.post("test_api/forecasting", JSON.stringify(query1));
        expect(Number(response['result'])).to.equal(120);

        let query2 = {
            'query': 'pooling-group-depot-short-window',
            'pooling-group': 'tc_resupply_study_1',
            'depot': 'USDEP1'
        }
        let response2 = await api.post("test_api/forecasting", JSON.stringify(query2));
        expect(Number(response2['result'])).to.equal(40);
    });

Given(/^site 102 is closed$/,
    async () => {
        logger.debug("depot-forecasting.steps: Given site 102 is closed");

        let query = {
            'query': 'remove-site',
            'study': 'tc_resupply_study_1',
            'depot': 'USDEP1',
            'site': '102'
        }
        let response = await api.post("test_api/forecasting", JSON.stringify(query));
        expect(response['result']).to.equal('success');
    });

Then(/^validate closed site$/,
    async () => {
        logger.debug("depot-forecasting.steps: Then validate closed site");
        expect(await TableValidation.containsData(depotForecasting.bufferLevelTable, testData["data-closed"])).to.be.true;
    });

Given(/^site 102 is open$/,
    async () => {
        logger.debug("depot-forecasting.steps: Given site 102 is open");

        let query = {
            'query': 'open-site',
            'study': 'tc_resupply_study_1',
            'depot': 'USDEP1',
            'site': '102'
        }
        let response = await api.post("test_api/forecasting", JSON.stringify(query));
        expect(response['result']).to.equal('success');
    });

Then(/^validate open site$/,
    async () => {
        logger.debug("depot-forecasting.steps: Then validate open site");
        expect(await TableValidation.containsData(depotForecasting.bufferLevelTable, testData["data-open"])).to.be.true;
    });

Then(/^validate lower page data(?: - '(.*?)')?$/,
    async (data: string) => {
        logger.debug("depot-forecasting.steps: Then validate lower page data " + data);

        if(!data) {
            expect(await depotForecasting.longWindowDials.count()).to.equal(2);
            expect(await TableValidation.containsColumns(depotForecasting.inventoryDetailColumns.get(0), testData["lower-columns"]["USDEP1"])).to.be.true;
            expect(await TableValidation.containsColumns(depotForecasting.inventoryDetailColumns.get(1), testData["lower-columns"]["USDEP1"])).to.be.true;
            expect(Number(await depotForecasting.windowDialSettings.get(0).getText())).equals(120);
            expect(Number(await depotForecasting.windowDialSettings.get(1).getText())).equals(120);
            expect(await TableValidation.containsData(depotForecasting.inventoryDetailBody.get(0), testData['lower-data-0']["USDEP1"])).to.be.true;
            expect(await TableValidation.containsData(depotForecasting.inventoryDetailBody.get(1), testData['lower-data-0']["USDEP1"])).to.be.true;
            expect(await TableValidation.containsData(depotForecasting.inventoryDetailFooters.get(0), testData['lower-data-footer-0']["USDEP1"])).to.be.true;
            expect(await TableValidation.containsData(depotForecasting.inventoryDetailFooters.get(1), testData['lower-data-footer-0']["USDEP1"])).to.be.true;
            await utils.screenshot("validate-lower-page-data.png");
        } else {
            for(let key of Object.keys(testData[data])) {
                expect(await TableValidation.containsData(await depotForecasting.getInventoryDetailTable(key), testData[data][key])).to.be.true;
                await utils.screenshot("validate-lower-page-data-"+data+"-"+key+".png");
            }
        }
    });

    Then(/^validate lower page footer - '(.*?)'$/,
    async (data: string) => {
        logger.debug("depot-forecasting.steps: Then validate lower footer " + data);

        for(let key of Object.keys(testData[data])) {
            expect(await TableValidation.containsData(await depotForecasting.getInventoryDetailFooter(key), testData[data][key])).to.be.true;
            await utils.screenshot("validate-lower-page-footer-"+data+"-"+key+".png");
        }
    });

When(/^long window dial is set to (\d+)$/,
    async function (value: number) {
        await this.page.setDialValue(2, value);
        expect(Number(await this.page.windowDialSettings.get(0).getText())).equals(Number(value));
        await utils.screenshot("change-dial-value-"+value+".png");
    });

Then(/^LW value is set to (\d+)$/,
    async function (value: number) {
        let data = [["",""]];
        data[0].push(""+value);
        expect(await TableValidation.containsData(this.page.bufferLevelTable, data)).to.be.true;
    });

Then(/^reset changes link is(?: (.*?))? displayed$/,
    async function (not: string) {
        await browser.waitForAngular();
        if(not) {
            expect(await this.page.resetChangesButton.isDisplayed()).to.be.false;
        } else {
            expect(await this.page.resetChangesButton.isDisplayed()).to.be.true;
        }
    });

When(/^changes are reset$/,
    async function () {
        await waitClick(this.page.resetChangesButton);
        await utils.screenshot("reset-changes.png");
    });

When(/^forecasting is run$/,
    async function () {
        await waitClick(this.page.runForecastingButton);
        await utils.screenshot("run-forecasting-button-click.png");
    });

Then(/^confirmation dialog is displayed$/,
    async function () {
        expect(await this.page.runConfirmationDialog.isDisplayed()).to.be.true;
    });

When(/^confirmation is accepted$/,
    async function () {
        await waitClick(this.page.dialogConfirmButton);
        browser.ignoreSynchronization = true;
        await browser.sleep(2000);
        if(await this.page.dialogConfirmButton.isPresent()) {
            await logger.info("Depot Forecasting: failed to click confirm run button, trying again...");
            await utils.refresh();
            await sidebar.openDepotForecastingPage();
            await waitClick(this.page.runForecastingButton);
            await waitClick(this.page.dialogConfirmButton);
        }
        await utils.screenshot("accept-confirmation.png");
        browser.ignoreSynchronization = false;
    });

Then(/^progress message is displayed$/,
    async function () {
        browser.ignoreSynchronization = true;
        await utils.waitVisible(this.page.forecastRunningMessage, 30000);
        expect(await this.page.forecastRunningMessage.isDisplayed()).to.be.true;
        await utils.screenshot("progress-message-is-displayed");
        browser.ignoreSynchronization = false;
    });

When(/^confidence dial is set to (\d+)$/,
    async function (value: number) {
        await this.page.setDialValue(1, value);
        await utils.screenshot("confidence-dial-set-"+value+".png");
    });

When(/^inventory parameters are applied$/,
    async function () {
        await waitClick(this.page.applyParametersButton);
        await waitClick(this.page.dialogConfirmButton);
    });

Then(/^long window dial value is (\d+)$/,
    async function (value: number) {
        expect(await this.page.getDialValue(1)).to.equal(value);
    });

Then(/^confidence dial value is (\d+)$/,
    async function (value: number) {
        expect(await this.page.getDialValue(0)).to.equal(value);
    });

When(/^record is updated for '(.*?)' depot and short window (\d+)$/,
    async function (depot: string, shortWin: number) {
        logger.debug("depot-forecasting.steps: When record is added for " + depot + " depot and short window " + shortWin);
        
        let query = {
            'query': 'new-pooling-group-depot-record',
            'pooling-group': this.study,
            'depot': depot,
            'short-window': shortWin
        }
        let result = await api.post('test_api/forecasting', JSON.stringify(query));
        expect(result['result']).to.equal('success');
    });

Then(/^(\d+) inventory detail tables exist$/,
    async function (count: number) {
        expect(await this.page.inventoryDetailBody.count()).to.equal(count);
    });

