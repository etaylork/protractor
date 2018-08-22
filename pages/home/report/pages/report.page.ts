import { Err, parseMetaData, Page, waitClick, waitText, waitVisible, UserRole } from '../../../../utils';
import { by, element, ElementFinder as EF, browser, ElementArrayFinder as EAF } from 'protractor';

import { IReport, strToNumArray } from '../';
import { Sidebar } from '../../../other/sidebar/sidebar.page';
import { logger } from '../../../../utils/logger';
import { TableDefinition } from 'cucumber';
import { TableValidation } from '../../..';

export type EFNumFunc = (num?: number) => EF;
export type EAFNumFunc = (num?: number) => EAF;
export type EFStrFunc = (str?: string) => EF;

const sidebar: Sidebar = new Sidebar();
 
export class Report extends Page implements IReport {

    columns: EAF = element.all(by.repeater("col in column_details"));
    subheaderData: EAF = element.all(by.repeater("(label, key) in subhead"));
    metaData: EAF = element.all(by.repeater("c in content_group"));
    selectSite: EAF = element.all(by.css('[md-highlight-text="ctrl.searchText"]'));

    cancelButton: EF = element(by.buttonText('Cancel'));
    PDFAndCSVCheck: EF = element(by.css('[disabled="disabled"]'));
    backButton: EF = element(by.id("report_back_btn"));
    csvButton: EF = element.all(by.css('[aria-label="Download CSV"]')).first();
    pdfButton: EF = element.all(by.css('[aria-label="Download PDF"]')).first();
    site_code: EF = element.all(by.css('[ng-repeat="(label, key) in header.header"]')).first();
    siteDropdown: EF = element(by.model("$mdAutocompleteCtrl.scope.searchText"));
    excursionDropDown: EF = element.all(by.css('[placeholder="Select Excursion/Shipment"]')).first();
    unblindingLabel: EF = element.all(by.binding("'REPORT_UNBLINDING_WARNING'")).first();
    headline: EF = element(by.css("[e2e-id='custom-report-title']"));
    notificationLink: EF = element.all(by.linkText('Notification')).first();
    notificationHeader: EF = element(by.xpath('//h2[contains(@class,"md-title")]'));
    notifPdfButton: EF = element(by.buttonText('Download PDF'));
    csvIcon: EF = element(by.css('md-icon[ng-if="!exportLoadingCSV"]'));
    pdfIcon: EF = element(by.css('md-icon[ng-if="!exportLoadingPDF"]'));

    rows: EAFNumFunc = (tbodyindex: number = 1) => element.all(by.xpath("(//tbody)[" + tbodyindex + "]//tr"));

    header: EFNumFunc = (theadIndex: number) => element.all(by.css("thead")).get(theadIndex).all(by.css("tr")).get(0);
    pages: EFNumFunc = (num: number): EF => element(by.xpath('//md-option[@value ="' + num + '"]'));
    backArrow: EFNumFunc = (index: number = 0): EF => element.all(by.css('[ng-click="$pagination.previous()"]')).get(index);
    nextArrow: EFNumFunc = (index: number = 0): EF => element.all(by.css('[ng-click="$pagination.next()"]')).get(index);
    selectPageButton: EFNumFunc = (index: number = 0): EF => element.all(by.model("$pagination.page")).get(index);
    selectRowsPerPageButton: EFNumFunc = (index: number = 0): EF => element.all(by.model("$pagination.limit")).get(index);
    elementLink: EFStrFunc = (link: string): EF => element.all(by.linkText(link)).first();
    patientReportLink: EFStrFunc = (patientID: string): EF => element(by.linkText(patientID));
    
    //page elements - uninitialized
    columnData: {};
    description: string;
    id: string;
    link: EF = element(by.linkText(this.id));
    linkID: string;
    testData: {};
    title: string;
    unblinding: boolean;

    async getReportDescription(): Promise<string> {
        let linkRow: EF = element(by.linkText(this.id)).element(by.xpath("ancestor::tr"));
        return await waitText(linkRow);
    }

    getLinkID(): string {
        return this.linkID ? this.linkID : this.title;
    }

    async open(timeout?: number): Promise<boolean> {
        try {
            if ((await browser.getCurrentUrl()).indexOf('/reports') === -1)
                await sidebar.openReportsPage();
            if (this.getLinkID() === undefined) return true;
            await waitClick(element(by.css("[e2e-id='"+this.getLinkID()+"']")), timeout);
            return true;
        } catch (e) {
            await logger.debug(Err.FAILED_TO_OPEN_REPORT(this.id, e.message));
            return false;
        }
    }

    async isVisible(): Promise<boolean> {
        try {
            await waitVisible(this.headline, 60000);
            return true;
        } catch (e) {
            await logger.debug(Err.REPORT_NOT_VISIBLE(e.message));
            return false;
        }
    }

    async verifyMetaData(table: TableDefinition): Promise<boolean> {

        await browser.waitForAngular();

        var headerArr = [];
        var metaDataArr = [];

        let process = async k => {
            await waitVisible(k);
            let text: string[] = await parseMetaData(await waitText(k));
            headerArr.push(text[0]);
            metaDataArr.push(text[1]);
        }

        let contains: (x: string[], y: string) => boolean = (x, y) => {
            for(let entry of x)
                if(entry.indexOf(y) !== -1) return true;
            return false;
        }
        //site header data 
        await process(this.site_code);

        //sub data
        let subHeaderCount = await this.subheaderData.count();
        for (let i = 0; i < subHeaderCount; i++) {
            await process(this.subheaderData.get(i));
        }

        //meta data 
        let metaDataCount = await this.metaData.count();
        for (let i = 0; i < metaDataCount; i++) {
            await process(this.metaData.get(i));
        }

        //prints all errors before returning false
        let verify = true;
        for (let key of table.hashes()) {

            if (!contains(headerArr, key.header) || !contains(metaDataArr, key.metaData)) {
                if (this.isDynamicData(key.header)) continue;
                logger.error("data " + key.header + "/" + key.metaData + " did not match " + headerArr + "/" + metaDataArr);
                verify = false;
            }
        }

        return verify;
    }

    private isDynamicData(header: string): boolean {
        switch (header) {
            case "Date of Screening": return true;
            case "Date of Randomization": return true;
            default: return false
        }
    }

    async selectExcursion(): Promise<void> {
        await waitClick(this.excursionDropDown);
        let ele = element(by.css('[md-virtual-repeat="item in $mdAutocompleteCtrl.matches"]'));
        await waitClick(ele);
    }

    async selectDropDownValue(value: string): Promise<void> {
        let dropDownTextValue: string = "";

        do{
            await this.siteDropdown.clear();
            await this.siteDropdown.sendKeys(value);
            let dropDownValue = element.all(by.xpath("//md-virtual-repeat-container//li//*[text()='"+value+"']")).first();
            dropDownTextValue = await waitText(dropDownValue);
            await waitClick(dropDownValue);
        }while(value != dropDownTextValue);
    }

    async verifySiteCodes(Data: {}, key: string): Promise<boolean> {
        await this.siteDropdown.clear();
        let siteCodes: string[] = [];
        let siteCodeCount = await this.selectSite.count();

        for (let i = 0; i < siteCodeCount; i++) {
            await browser.waitForAngular();
            await waitVisible(this.selectSite.get(0));
            let siteCode = await this.selectSite.get(i);
            let value = await waitText(siteCode);
            siteCodes.push(value);
        }

        if (siteCodeCount !== Data[key].length) {
            await logger.warn(Err.SELECT_SITE_COUNT_DOES_NOT_MATCH_DATA(siteCodeCount, Data[key].length));
            return false;
        }

        for (let x in Data[key]) {
            if (siteCodes.indexOf(Data[key][x]) == -1) {
                await logger.warn(Err.COULD_NOT_FIND_DATA_IN_SITE_CODE(Data[key][x], siteCodes))
                return false
            }
        }

        return true;
    }

    async displaysData(preparedData: {}, specificHeader?: EF): Promise<boolean> {
        let header: EF = typeof specificHeader !== 'undefined' ? specificHeader : this.tableHeaderRow;
        let table: EF = header.element(by.xpath("ancestor::table"));
        return await TableValidation.validateTable(table, preparedData);
    }

    async downloadCSV(): Promise<void> {
        await waitClick(this.csvButton);
        await waitVisible(this.csvIcon);
    }

    async downloadPDF(): Promise<void> {
        await waitClick(this.pdfButton);
        await waitVisible(this.pdfIcon);
    }
    
    async advancePage(buttonindex?: number): Promise<number> {
        let currentPage: number = Number(await waitText(this.selectPageButton(buttonindex)));
        await this.nextArrow(buttonindex).click();
        return currentPage;
    }

    async backPage(buttonindex?: number): Promise<number> {
        let currentPage: number = Number(await waitText(this.selectPageButton(buttonindex)));
        await this.backArrow(buttonindex).click();
        return currentPage;
    }

    async isUnblinded() {
        try {
            await waitVisible(this.unblindingLabel, 15000);
            return true;
        } catch (e) {
            return false;
        }
    }

    async validatePatientRowsInOrder(column: string): Promise<boolean> {
        let table = await this.getTable(column);
        let rows = table.all(by.css("tbody tr"));
        let columnIndex = await this.getColumnIndex(column);
        return await TableValidation.validateColumnDataDESC(rows, columnIndex);
    }

    async verifyDropDownValues(table: TableDefinition): Promise<boolean> {
        let dropDownValues = [];
        let eleArr = element.all(by.css('[md-extra-name="$mdAutocompleteCtrl.itemName"]'));

        await waitClick(this.siteDropdown, 15000, await eleArr.first());

        //get all the values in the drop down menu
        for(let i = 0 ; i < await eleArr.count(); i++){
            let text = await waitText(eleArr.get(i));
            dropDownValues.push(text);
        }

        //compare the drop down values with the values in the table
        let result = true;
        for(let key of table.hashes()){
            if(dropDownValues.indexOf(key.values) === -1){
                logger.error("verfiyDropDownValues(): " + key.value + " is not in " + dropDownValues);
                result = false;
                break;
            }
        }

        //close the drop down menu
        await waitClick(this.body);

        return result;
    }

    async hasNoVisibleData(user?: UserRole): Promise<boolean> {
        return await this.isVisible() && (await this.siteDropdown.getText() == "");
    }

    async getTable(column: string): Promise<EF> {
        let tables = element.all(by.css("table"));
        for(let i = 0; i < await tables.count(); i++){
            let table = tables.get(i);
            let tableHeader = table.all(by.css("thead")).first();
            let columns = await waitText(tableHeader);
            if(columns.indexOf(column) !== -1) {
                return tables.get(i);
            }
        }

        throw Error("getTable(): column header is not found in any tables - " + column);
    }

}
