import { browser, expect, utils, waitClick, waitText, TableDefinition } from '../../../utils';

import { AddSitePage } from '../../../pages';

const addSitePage: AddSitePage = new AddSitePage();

const { When, Then } = require('cucumber');

When(/^I enter the following details for the new site$/, { timeout: 500 * 1000 },
    async function (table: TableDefinition) {
        let details = table.hashes()[0];

        // handles inputs for drop downs first
        for (let i = 0; i < 5; i++) {
            try {
                await addSitePage.selectDropoDownValue(addSitePage.countryDropDown, details['Country']);
                await addSitePage.selectDropoDownValue(addSitePage.timeZoneDropDown, details['Time zone']);
                await addSitePage.selectDropoDownValue(addSitePage.siteStatusDropDown, details['Site status']);
                await addSitePage.selectDropoDownValue(addSitePage.screeningDropDown, details['Screening Open?']);
                await addSitePage.selectDropoDownValue(addSitePage.randomizeDropDown, details['Randomization Open?']);
                await addSitePage.selectDropoDownValue(addSitePage.utilityDropDown, details['Utility Field']);
                await addSitePage.selectDropoDownValue(addSitePage.protocolDropDown, details['Study protocol version']);
                await addSitePage.selectSiteMonitor(details['Site Monitor']);
                break;
            } catch (e) {
                await utils.refresh();
            }

        }

        await addSitePage.enterInputField(addSitePage.investigatorNameField, details['Investigator']);
        await addSitePage.enterInputField(addSitePage.siteNumberField, details['StudySite']);
        await addSitePage.enterInputField(addSitePage.deliverContactField, details['Delivery Contact']);
        await addSitePage.enterInputField(addSitePage.siteAddressField, details['Site Address']);
        await addSitePage.enterInputField(addSitePage.secondAddressField, details['address 2']);
        await addSitePage.enterInputField(addSitePage.thirdAddressField, details['address 3']);
        await addSitePage.enterInputField(addSitePage.cityField, details['city']);
        await addSitePage.enterInputField(addSitePage.stateField, details['state']);
        await addSitePage.enterInputField(addSitePage.zipCodeField, details['zip code']);
        await addSitePage.enterInputField(addSitePage.sitePhoneField, details['Site Phone']);

        if (details['Shipping Address'] === 'checked') {
            let shippingDetails = table.hashes()[1];
            await waitClick(addSitePage.diffShippingAddressCheckBox);

            await addSitePage.enterInputField(addSitePage.shippingAddressField, shippingDetails['Site Address']);
            await addSitePage.enterInputField(addSitePage.shippingSecondAddressField, shippingDetails['address 2']);
            await addSitePage.enterInputField(addSitePage.shippingThirdAddressField, shippingDetails['address 3']);
            await addSitePage.enterInputField(addSitePage.shippingCityField, shippingDetails['city']);
            await addSitePage.enterInputField(addSitePage.shippingStateField, shippingDetails['state']);
            await addSitePage.enterInputField(addSitePage.shippingZipCodeField, shippingDetails['zip code']);
            await addSitePage.enterInputField(addSitePage.shippingPhoneField, shippingDetails['Site Phone']);
        }

        await addSitePage.enterInputField(addSitePage.screeningCapField, details['Screening cap']);
        await addSitePage.enterInputField(addSitePage.randomizeCapField, details['Randomization Cap']);
        if (details['Allow destruction on site?'] === 'checked') await waitClick(addSitePage.destructionSiteCheckbox);


        await browser.actions().mouseMove(addSitePage.siteMonitorDropDown).perform();
        await utils.screenshot('details-new-site.png')
    });

When(/^I enter the following quantities for the site inventory caps$/,
    async function (table: TableDefinition) {

        for (let entry of table.hashes()) {
            await addSitePage.enterInventoryCap(entry['kit'], entry['quantity']);
        }
    });

When(/^I click the create site button$/,
    async function () {
        await waitClick(addSitePage.createSiteButton);
    });

When(/^I edit the details for the site$/,
    async function (table: TableDefinition) {
        await addSitePage.editStudySiteDetails(table);
    });

Then(/^a error message is displayed stating site number already exists$/,
    async function () {
        expect(await waitText(addSitePage.siteCodeForm)).to.contain('Site Number already exists.');
    });

Then(/^a error message is displayed stating the time zone field is required$/,
    async function () {
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.timeZoneDropDown)).to.be.true;
    });

Then(/^the (?:create site|edit site) review page displays the following details$/,
    async function (table: TableDefinition) {

        for (let entry of table.hashes()) {
            if (entry['Details'] == "Bulk kits") {
                let kitsAndQuantities = entry['Values'].split(" , ");
                for (let entry in kitsAndQuantities) {
                    let data = kitsAndQuantities[entry].split(":");
                    expect(await addSitePage.verifyKitsOnReviewPage(data[0], data[1])).to.be.true;
                }
            } else if (entry['Details'] == "Site Monitor" && entry['Values'].indexOf(",") !== -1) {
                let siteMonitors = entry['Values'].split(" , ");
                for (let s in siteMonitors) {
                    expect(await addSitePage.verifyDetailsOnReviewPage(entry['Details'], siteMonitors[s])).to.be.true
                }
            } else {
                expect(await addSitePage.verifyDetailsOnReviewPage(entry['Details'], entry['Values'])).to.be.true;

            }
        }
    });

Then(/^the require fields are highlighted with error message$/,
    async function () {
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.siteNumberField)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.investigatorNameField)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.countryDropDown)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.zipCodeField)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.siteStatusDropDown)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.screeningDropDown)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.randomizeDropDown)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.deliverContactField)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.siteAddressField)).to.be.true;
        expect(await addSitePage.verifyRequiredFieldErrMsg(addSitePage.cityField)).to.be.true;
        await utils.screenshot('error-messages-required-fields.png');
    });