import { by, element, logger, EF, EAF, EFNumFunc, EAFNumFunc, EFStrFunc, waitText,
         waitClick, waitVisible, utils } from '../../../../utils';
import { TableValidation } from '../../../other/validation/table/table-validation.page';

import { Report } from '../';
import { kitTestData, locationTestData, tableDataCountry, tableDataReportingMethod, tableDataSupplyDepot,
    tableDataExcursionStatus, barChartDataReportingMethod, barChartDataExcursionStatus, barChartDataCountry,
    barChartDataSupplyDepot } from '../data/test-data-temr/index';

const localTimeout: number = 1500;

export class TemperatureExcursionMetrics extends Report {

    id: string = "Temperature Excursion Metrics";
    description: string = "Study trends related to temperature excursion";
    linkID: string = "REPORT_TEMPERATURE_EXCURSIONS_METRICS";

    excursionTable: EF;
    rect: EF;
    filterTableData: {};
    filterBarChartData: {};
    tableIndex: number;

    headline: EF = element(by.css(".md-headline"));
    stackedRadioButton: EF = this.elementsWithText("Stacked").first();
    groupedRadioButton: EF = this.elementsWithText("Grouped").first();
    overTimeExcurisonDate: EF = element(by.css("excursions-time-chart g.tick"));
    overTimeChartYAxis: EF = element.all(by.css("excursions-time-chart *.domain")).get(1);
    overTimeChartXAxis: EF = element.all(by.css("excursions-time-chart *.domain")).get(0);
    overTimeChartRadioButton: EF = element.all(by.css("excursions-time-chart circle")).first();
    overTimeExcursionPoints: EAF = element.all(by.css("excursions-time-chart *.nv-scatterWrap"));
    filterValues: EAF = element.all(by.css("div.md-active md-option"));

    yAxisExcursionNames: EAFNumFunc = (tableIndex: number) => element.all(by.xpath("(.//*[name()='svg'])[" + tableIndex + "]//*[name()='p']"));
    clearFilterButton: EFNumFunc = (tableIndex: number): EF => element(by.xpath('(//a[@aria-label="Clear filters"]//md-icon)[' + tableIndex + ']'));
    metricsTable: EFNumFunc = (tableIndex: number): EF => element(by.xpath("(.//table)[" + tableIndex + "]"));
    barChartArea: EFNumFunc = (tableIndex: number): EF => element(by.xpath("(//*[name()='svg'])[" + tableIndex + "]"));
    dropDownButton: EFStrFunc = (dropDown: string): EF => element(by.css('[placeholder="' + dropDown + '"]'));
    filterValue: EFStrFunc = (filter: string) => element(by.css("div.md-active")).element(by.css('[value="' + filter + '"]'));

    //setter functions
    setTableData(table: string): void {
        switch (table) {
            case "Kit Type":
                this.tableIndex = 1;
                this.rect = element(by.css('excursions-kit-chart rect'));
                this.excursionTable = element(by.css('[e2e-id="kit-table-row"]'));
                return;
            case "Location Type":
                this.tableIndex = 2;
                this.rect = element(by.css('excursions-geo-chart rect + text'));
                this.excursionTable = element(by.css('[e2e-id="location-table-row"]'));
                return;
            case "Over Time Type":
                this.excursionTable = element(by.css('[e2e-id="over-time-chart-row"]'));
                return;
        }
    }

    setFilterTableData(dropDown: string, table: string): void {

        switch (dropDown) {
            case "Reporting Method":
                this.filterTableData = tableDataReportingMethod[table];
                this.filterBarChartData = barChartDataReportingMethod[table];
                return;
            case "Excursion Status":
                this.filterTableData = tableDataExcursionStatus[table];
                this.filterBarChartData = barChartDataExcursionStatus[table];
                return;
            case "Supply Depot":
                this.filterTableData = tableDataSupplyDepot;
                this.filterBarChartData = barChartDataSupplyDepot;
                return;
            case "Country":
                this.filterTableData = tableDataCountry;
                this.filterBarChartData = barChartDataCountry;
                return;
        }

    }

    //low-level functions
    async excursionCountDisplayed(tableIndex: number): Promise<boolean> {
        let excursionCount = this.barChartArea(tableIndex).all(by.xpath(".//*[name()='text'][@style='text-anchor: middle;']")).last();
        return await excursionCount.isDisplayed();
    }

    async isPopUpDisplayed(): Promise<boolean> {
        let popUpPanel: EF = element.all(by.css('[class="nvtooltip xy-tooltip"]')).first();
        return await popUpPanel.isDisplayed();
    }

    async getChartWidth(): Promise<number> {
        await waitVisible(this.rect);
        let width: string = await this.rect.getAttribute('width');
        return Number(width);
    }

    async clearTableFilters(): Promise<void> {
        await waitClick(this.clearFilterButton(this.tableIndex));
    }

    //selects a specific filter value in the drop down menu
    async selectFilterValue(filterValue: string, dropDown: string): Promise<void> {
        let filterDropDown: EF = this.excursionTable.element(by.css('[placeholder="' + dropDown + '"]'));

        await waitClick(filterDropDown, localTimeout, await this.filterValues.get(0));

        if (filterValue === 'All') await waitClick(this.filterValues.get(0));
        else await waitClick(this.filterValue(filterValue));
    }

    //high-level functions
    async hasRequiredData(excursionTable: string): Promise<boolean> {

        await utils.screenshot("temr-report-temr.png");
        this.setTableData(excursionTable);

        switch (excursionTable) {
            case "Kit Type":
                this.tableIndex = 1;
                return await TableValidation.containsColumns(this.metricsTable(1), Object.keys(kitTestData)) && await this.isUnblinded() &&
                    await this.containsData(kitTestData) && await this.rect.isDisplayed();
            case "Location Type":
                this.tableIndex = 2;
                return await TableValidation.containsColumns(this.metricsTable(2), Object.keys(locationTestData)) && await this.isUnblinded() &&
                    await this.containsData(locationTestData) && await this.rect.isDisplayed();
            case "Over Time Type":
                return await this.isUnblinded() && await this.overTimeChartXAxis.isDisplayed() &&
                    await this.overTimeChartYAxis.isDisplayed() && await this.overTimeExcurisonDate.isDisplayed();

            default:
                return false;
        }
    }

    //Verifys json data gathered from the UI matches static json data
    async containsData(testData: {}, filterTestData?: {}): Promise<boolean> {
        let result: boolean = true;
        let data: {} = {};
        data = (filterTestData !== undefined ? filterTestData : await this.getTableData(this.tableIndex));

        let keys: string[] = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let rowA: string[] = data[keys[i]];
            let rowB: string[] = testData[keys[i]];

            for (let j = 0; j < rowA.length; j++) {
                let a: string = rowA[j];
                let b: string = rowB[j];
                if (a !== b) {
                    logger.error("Report data didn't match column "+ keys[i] +" data: " + a + " != " + b);
                    throw Error('ERROR: containsData(): validating data');
                }
            }
        }

        return result;
    }

    //returns an array of all filter values to filter from in the drop down menu
    private async getFilterValues(): Promise<EF[]> {
        let result: EF[] = [];

        //waits for the values in the drop down to be visible
        await waitVisible(this.filterValues.get(0));
        let counter: number = await this.filterValues.count();
        if (counter == 0) throw Error('No values in the drop down to filter from');

        //add all filter values into an array
        for (let i = 0; i < counter; i++) {
            let filterValue: EF = await this.filterValues.get(i);
            result.push(filterValue);
        }

        await waitClick(element(by.css('body')));
        return result;
    }

    async filterDropDowns(dropDown: string): Promise<{}[]> {
        let filterDropDown = this.excursionTable.element(by.css('[placeholder="' + dropDown + '"]'));
        let result = [];

        await waitClick(filterDropDown, localTimeout, await this.filterValues.get(0));

        let filterValues: EF[] = await this.getFilterValues();
        let counter: number = filterValues.length;
        for (let i = 0; i < counter; i++) {
            let filterValue: EF = filterValues[i];
            await waitClick(filterDropDown, localTimeout, filterValues[i]);
            await waitClick(filterValue);
            //get table and chart data
            if (this.tableIndex == undefined) continue;
            else result = await this.getFilterData(result);

            await utils.screenshot(dropDown + 'filtered.png');
        }
        //if a table is visible will clear the filters for that table
        if (this.tableIndex !== undefined) await waitClick(this.clearFilterButton(this.tableIndex));

        return result;
    }

    //returns the table and chart data in json format after filtering all values in A drop down menu
    async getFilterData(result?: any[]): Promise<{}[]> {
        let chartData: {};
        let tableData: {};

        //gets the first set of table and chart json data to test
        if (result == undefined || result[0] == null) {
            tableData = await this.getTableData(this.tableIndex);
            chartData = await this.getChartData();
            return [tableData, chartData]
        } else {
            //joins the new json data set with the first set of table and chart json data set
            let data: {} = await this.getTableData(this.tableIndex);
            let data2: {} = await this.getChartData();
            let keys: string[] = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                result[0][keys[i]] = result[0][keys[i]].concat(data[keys[i]]);
                if (result[1].hasOwnProperty(keys[i]))
                    result[1][keys[i]] = result[1][keys[i]].concat(data2[keys[i]]);
            }

            return [result[0], result[1]];
        }
    }

    //creates json data set from the excursion tables
    private async getTableData(tableIndex: number = 1): Promise<{}> {
        let rows: EAF = this.metricsTable(tableIndex).all(by.css("tr"));
        let data: {} = {};

        let columnHeaders: EAF = rows.get(0).all(by.css("th"));
        for (let i = 0; i < await columnHeaders.count(); i++) {
            let ele: string = await waitText(columnHeaders.get(i));
            data[ele] = [];
        }

        let keys: string[] = Object.keys(data);
        for (let i = 1; i < await rows.count(); i++) {
            let row: EF = await rows.get(i)
            let columns: EAF = row.all(by.css("td"));
            for (let j = 0; j < await columns.count(); j++) {
                let column: EF = await columns.get(j);
                data[keys[j]].push(await waitText(column));
            }
        }
        return data;
    }

    //creates json data set from the x and y axis data on the excursion charts
    private async getChartData(): Promise<{}> {
        let keys = Object.keys(this.filterTableData);
        let chartData: string[][] = await this.getYAxisChartData();
        let result: {} = {};

        for (let i in chartData) {
            result[keys[i]] = chartData[i];
        }
        return result;
    }

    private async getYAxisChartData(): Promise<string[][]> {
        let excursionNames = this.yAxisExcursionNames(this.tableIndex);
        let yAxisData: string[] = [];

        for (let i = 0; i < await excursionNames.count(); i++) {
            let ele = await excursionNames.get(i);
            let text = await waitText(ele);
            yAxisData.push(text);
        }

        return await this.getXAxisChartData(yAxisData);
    }

    private async getXAxisChartData(yAxisData: string[]): Promise<string[][]> {
        let excursionCount = element.all(by.xpath("(//*[name()='svg'])[" + this.tableIndex + "]//*[name()='text'][@text-anchor='start']"));
        let xAxisData: string[] = [];

        for (let i = 0; i < await yAxisData.length; i++) {
            let ele = await excursionCount.get(i);
            let text = await waitText(ele);
            xAxisData.push(text);
        }

        return [yAxisData, xAxisData];
    }

}