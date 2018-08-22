import { browser, expect, logger, waitClick, waitText, waitVisible, utils, Msg } from '../../utils';

import { SiteResupplyPage } from '../../pages/supply/resupply/site-resupply.page';

const siteResupplyPage: SiteResupplyPage = new SiteResupplyPage();

const { When, Then } = require('cucumber');

When(/^I select the resupply '(level|depot|pooling group|country|site)' dropdown '(.*?)'$/,
    async (dropdown:string, option:string) => {
        await siteResupplyPage.selectDropdownOption(dropdown, option);
    });

Then(/^'(.*?)' resupply '(level|depot|pooling group|country|site)' is displayed$/,
    async (option:string, dropdown:string) => {
        expect(await siteResupplyPage.getDropdownText(dropdown)).to.contain(option);
    });

Then(/^resupply dropdown '(level|depot|pooling group|country|site)' is '(enabled|disabled)'$/,
    async (dropdown:string, state:string) => {
        expect(await siteResupplyPage.getResupplyDropdownState(dropdown)).to.equal(state);
    });

Then(/^no resupply '(level|depot|pooling group|country|site)' is displayed$/,
    async(dropdown:string) => {
        expect(await siteResupplyPage.dropdownIsBlank(dropdown)).to.be.true;
    });

When(/^I run the resupply by clicking the 'run resupply' button$/,
    async() => {
        await siteResupplyPage.runResupplyButton.click();
    });

Then(/^'resupply running' completion is indicated$/,
    async () => {
        await logger.debug("Waiting for resupplyPage.confirmResupplyButton to be clickable");
        await waitClick(siteResupplyPage.confirmResupplyButton);
        await browser.driver.manage().timeouts().setScriptTimeout(40000);
        await browser.driver.manage().timeouts().implicitlyWait(40000);
        await waitVisible(siteResupplyPage.prancerMessage);
        expect(await waitText(siteResupplyPage.prancerMessage)).to.contain("Resupply run completed successfully.");
        await browser.driver.manage().timeouts().setScriptTimeout(browser.allScriptsTimeout);
        await utils.screenshot('resupply-run-completed.png');
    });

Then(/^resupply run has correct configuration in admin page$/,
    async() => {
        //do nothing
    });

    When(/^I decline the order with '(.*?)' kits$/,
    async function(quantity: string){
        await siteResupplyPage.filterColumn('Quantity requested', quantity);
        
        await waitClick(siteResupplyPage.linkIdentifier('Manage'));
        await waitClick(siteResupplyPage.declineButton);
        await waitClick(siteResupplyPage.buttonIdentifier('Confirm'));
        expect(await waitText(Msg.PRANCER_MESSAGE) ).to.contain('Shipment request successfully declined.');
        
        await utils.screenshot('shipment-request-declined.png');
        await waitClick(siteResupplyPage.backButton);
    });

When(/^I create a shipment from the order with '(.*?)' kits$/,
    async function(quantity: string){
        await siteResupplyPage.filterColumn('Quantity requested', quantity);
        await waitClick(siteResupplyPage.linkIdentifier('Manage'));
        await waitClick(siteResupplyPage.buttonIdentifier('Next'));
        await waitClick(siteResupplyPage.submitButton);
        await utils.screenshot('shipment-created.png');
        await waitClick(siteResupplyPage.toShipmentsButton);
    });