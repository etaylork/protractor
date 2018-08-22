import { utils, expect, browser, waitClick, waitVisible } from '../../../utils';

const { When, Then } = require('cucumber');

When(/^I filter the '(.*?)' for all options in the drop down menu$/,
    async function (dropDown: string) {
        this.report.setFilterTableData(dropDown, this.table);
        if (this.report.rect !== undefined)
            this.chartWidth = await this.report.getChartWidth();
        let filterResults = await this.report.filterDropDowns(dropDown);
        this.dropDown = dropDown;
        this.filterTableData = filterResults[0];
        this.filterBarChartData = filterResults[1];
    });

When(/^I select '(.*?)' for the '(.*?)' filter$/,
    async function (value: string, dropDown: string) {
        this.dropDown = dropDown;
        await this.report.selectFilterValue(value, dropDown);
        await utils.screenshot(value + '-filtered.png');
    });

When(/^I hover over the bar chart$/,
    async function () {
        await browser.actions().mouseMove(this.report.rect).perform();
        await utils.screenshot('pop-up-panel-displayed.png');
    });

When(/^I select the stacked radio button$/,
    async function () {
        this.chartWidth = await this.report.getChartWidth();
        await waitClick(this.report.stackedRadioButton);
        await utils.screenshot('select-stacked-radion-button.png');
    });

When(/^I select the grouped radio button$/,
    async function () {
        this.chartWidth = await this.report.getChartWidth();
        await waitClick(this.report.groupedRadioButton);
        await utils.screenshot('select-grouped-radio-button.png');
    });

When(/^I select a radio button on the Over Time Chart$/,
    async function () {
        await waitClick(this.report.overTimeChartRadioButton);
        await utils.screenshot('select-over-time-radio-button.png');
    });

When(/^I get the updated table and chart data$/,
    async function () {
        this.report.setFilterTableData(this.dropDown, this.table);
        let filterResults = await this.report.getFilterData();
        this.filterTableData = filterResults[0];
        this.filterBarChartData = filterResults[1];
    });

Then(/^the '(.*?)' filter dropdown is displayed$/,
    async function (dropdown: string) {
        expect(await this.report.dropDownButton(dropdown).isDisplayed()).to.be.true;
        await utils.screenshot(dropdown + '-filter-dropdown-displayed.png');
    });

Then(/^the width of the bar chart '(.*?)'$/,
    async function (size: string) {
        await waitVisible(this.report.rect);
        let newChartWidth: number = await this.report.getChartWidth();
        if (size === "increases") {
            await expect(newChartWidth).to.be.gte(this.chartWidth);
        } else { // size === 'decreases'
            await expect(newChartWidth).to.be.lte(this.chartWidth);
        }
        await utils.screenshot("bar-chart-updates.png");
    });

Then(/^a popup panel appears over the bar chart$/,
    async function () {
        expect(await this.report.isPopUpDisplayed()).to.be.true
        await utils.screenshot("popup-panel-displayed.png");
    });

Then(/^the data updates accordingly$/,
    async function () {
        expect(await this.report.containsData(this.filterTableData, this.report.filterTableData)).to.be.true;
        await utils.screenshot(this.table + "-" + this.dropDown + ".png");
    });

Then(/^the bar chart updates accordingly$/,
    async function () {
        expect(await this.report.containsData(this.filterBarChartData, this.report.filterBarChartData)).to.be.true;
        await utils.screenshot('bar-chart-updates.png');
    });

Then(/^the '(.*?)' table shows accurate data$/,
    async function (table: string) {
        this.table = table;
        expect(await this.report.isVisible()).to.be.true;
        await this.report.hasRequiredData(table);
        await utils.screenshot(table + '-data-displayed.png');
    });

Then(/^the location bar graph displays accurate data$/,
    async function () {
        for (let i = 0; i < await this.report.yAxisExcursionNames(2).count(); i++) {
            expect(await this.report.yAxisExcursionNames(2).get(i).isDisplayed()).to.be.true;
        }
        expect(await this.report.excursionCountDisplayed(2)).to.be.true;
        await utils.screenshot('location-bar-graph-displayed.png');
    });

Then(/^the total amount of kits displayed on the Over Time Chart is '(\d+)'$/,
    async function (excurisonPoints: number) {
        expect(await this.report.overTimeExcursionPoints.count()).to.equal(excurisonPoints);
    });