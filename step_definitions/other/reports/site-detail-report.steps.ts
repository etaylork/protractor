import { expect, utils } from '../../../utils';
import { defineSupportCode, TableDefinition } from 'cucumber';

defineSupportCode(({ Then }) => {

    Then(/^all the site details and data are now displayed$/,
        async function (table: TableDefinition) {
            expect(await this.report.siteID.isDisplayed()).to.be.true;
            expect(await this.report.address.isDisplayed()).to.be.true;
            expect(await this.report.verifyElementsAreDisplayed(this.report.headerData)).to.be.true;

            for (let key of table.hashes()) {
                expect(await this.report.verifyPanelDetails(key.header, this.report.headerData), key.header).to.be.true;
            }
            await utils.screenshot("SDR-DataDisplayed.png");
        });
});