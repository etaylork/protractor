import { browser, by, element, ElementFinder, EAF, expect, Key, logger, utils, waitClick, waitText, waitVisible, TableDefinition } from '../utils';
import { Validation } from '../pages';

import { SiteResupplyPage } from '../pages/supply/resupply/site-resupply.page';
import { TableValidation } from '../pages/other/validation/table/table-validation.page';
import { UtilPage } from '../pages/other/util.page';

const remote = require('selenium-webdriver/remote');

const siteResupplyPage: SiteResupplyPage = new SiteResupplyPage();
const utilPage: UtilPage = new UtilPage();

const { When, Then } = require('cucumber');

Then(/^(button with text '(.*?)'|'(.*?)' button) is (displayed|not displayed)$/,
    async (text:string, displayed: string) => {
        if(!utils.contains(displayed, "not displayed"))
            expect(await utilPage.buttonWithText(text).isDisplayed()).to.be.true;
        else 
            expect(await utilPage.buttonWithText(text).isPresent()).to.be.false;
    });

When(/^I click(?: button with text '(.*?)')?(?: the '(.*?)' button)?(?: the '(.*?)' link)?$/,
    async (text1: string, text2: string, linkText: string) => {
        if (linkText) {
            await waitClick(element(by.xpath("//a[contains(text(),'Back to Patients')]")));//utilPage.linkIdentifier(linkText));
        }
        else
            await waitClick(await utilPage.buttonWithText(text1 ? text1 : text2));
    });

Then(/^'(.*?)' confirmation message is displayed$/,
    async (message:string) => {
        if(message === 'resupply running') {
            expect(await siteResupplyPage.confirmationMessage.getText()).to.equal("Do you want to run resupply?")
        } else if (message === 'shipment success') {
            expect(await utilPage.containsMessageWithText("Successfully created shipment")).to.be.true;
            await utils.screenshot('site-shipment-created.png');
        } else if(message === 'titration dispensing') {
            let titrationDispensingMessage: string = "Please dispense the following bulk supply to patient";
            let expectMsg: string = "titration dispensing message";
            expect(await utilPage.messageWithText(titrationDispensingMessage).isPresent(), expectMsg).to.be.true;
        } else if(message === 'transit success') {
            let transitSuccessMessage: string = "Shipment has been placed into In Transit status";
            expect(await utilPage.containsMessageWithText(transitSuccessMessage)).to.be.true;
            await utils.screenshot('transit-success.png');
        }else if(message === 'receive shipment'){
            let receiveShipmentMessage: string = "Shipment has been placed into Received status";
            expect(await utilPage.containsMessageWithText(receiveShipmentMessage)).to.be.true;
            await utils.screenshot('receive-shipment-success.png');
        } else {
            throw Error("unidentified confirmation message type");
        }
    });
    
Then(/^(?:the )?(?: )?(?:patient )?table shows$/,
    async function (td: TableDefinition) {
        await utils.screenshot("then-table-shows.png")
        let myJson: {} = utils.tableToJsonStrObj(td);
        for (let key of Object.keys(myJson)) {
            let index: number = await TableValidation.getIndexInRow(utilPage.tableHeaderRow, key, "th");
            let evaluate: (value: string, data?: string) =>
                Promise<boolean> = async (value: string, data?: string) =>
                    {
                        if(utils.contains(data, "/")) {
                            let result: string[] = data.split("/");
                            return await Validation.containsText(value, result[0]) || await Validation.containsText(value, result[1]);
                        } else if(utils.contains(data, '""')) {
                            return value === "";
                        } else if (data.indexOf('"') == 0) {
                            return await Validation.date(data, value);
                        } else {
                            return await Validation.containsText(value, data);
                        }
                    }
            let getValue: (ele: ElementFinder) =>
                Promise<string> = async (ele: ElementFinder) =>
                    await ele.getText();
            expect(await TableValidation.validateColumn(utilPage.tableBodyRows, index, evaluate, getValue, myJson[key])).to.be.true;
        }
    });

Then(/^table does not show$/,
    async function (td: TableDefinition) {
        await utils.screenshot("then-table-shows.png");
        let myJson: {} = utils.tableToJsonStrObj(td);
        console.log("myJson: " + JSON.stringify(myJson, null, 2));
        for(let key of Object.keys(myJson)) {
            let index: number = await TableValidation.getIndexInRow(utilPage.tableHeaderRow, key, "th");
            let evaluate: (value: string, data?: string) =>
                Promise<boolean> = async (value: string, data?: string) =>
                    {
                        let result: string[] = data.split("/");
                        return await Validation.containsText(value, result[0]) || await Validation.containsText(value, result[1]);
                    }
            let getValue: (ele: ElementFinder) =>
                Promise<string> = async (ele: ElementFinder) =>
                    await ele.getText();
            expect(await TableValidation.validateColumn(utilPage.tableBodyRows, index, evaluate, getValue, myJson[key])).to.be.true;
        }
    });

Then(/^the table shows accurate data - '(.*?)'$/,
    async function (dataId: string) {
        await this.page.containsData(dataId);
    });

Then(/^actions dropdown does not contain '(.*?)'$/,
    async function (entry: string) {
        let actionsLink: ElementFinder = this.page.table.all(by.cssContainingText("td", "Actions")).first();
        let test = async (ele: ElementFinder, str: string) => {
            await waitClick(ele);
            let nopEle: ElementFinder = element(by.cssContainingText(".md-open-menu-container", str));
            let result: boolean = await nopEle.isPresent();
            await browser.actions().sendKeys(Key.ESCAPE).perform();
            return result;
        }
        expect(await test(actionsLink, entry)).to.be.false;
    });

Then(/^'(.*?)' message is '(displayed|not displayed)'$/,
    async function (messageText: string, status: string) {
        let messageElement: ElementFinder = utilPage.messageWithText(messageText);
        if (status === 'displayed') {
            expect(await messageElement.isDisplayed()).to.be.true;
        } else if (status === 'not displayed') {
            expect(await messageElement.isPresent()).to.be.false;
        }
    });

When(/^I open the '(.*?)' dropdown$/,
    async function (dropdownName: string) {
        let dropdown: ElementFinder = utilPage.dropdownWithText(dropdownName);
        await waitClick(dropdown);
    });

When(/^I select the '(.*?)' input$/,
    async function (inputName: string) {
        let dropdown: ElementFinder = utilPage.inputWithText(inputName);
        await waitClick(dropdown);
    });

When(/^I open the '(.*?)' menu$/,
    async function (menuName: string) {
        let dropdown: ElementFinder = utilPage.menuWithText(menuName);
        await waitClick(dropdown);
    });

When(/^(?:I )?enter text '(.*?)'$/,
    async function (inputText: string) {
        await browser.actions().sendKeys(inputText).perform();
        await browser.actions().sendKeys(Key.ESCAPE).perform();
    });

Then(/^'(.*?)' option is (available|not available)$/,
    async function (optionValue, input) {
        if (!utils.contains(input, "not")) {
            let option: ElementFinder = utilPage.optionWithText(optionValue);
            let msg: string = "option is displayed with locator " + option.locator();
            await waitVisible(option);
            expect(await option.isDisplayed(), msg).to.be.true;
        } else {
            let option = utilPage.optionWithText(optionValue);
            let status = await utils.status(option);
            let msg = "option displayed is false with locator" + option.locator();
            expect(status.present, msg).to.equal(false);
        }
    });

When(/^I select option '(.*?)'$/,
    async function (optionName: string) {
        await waitClick(utilPage.optionWithText(optionName));
    });

Then(/^'(.*?)' field shows '(.*?)'$/,
    async function (fieldName: string, fieldValue: string) {
        let fieldValueElement: ElementFinder = utilPage.fieldValue(fieldName)
        let msg: string = fieldName + " field shows " + fieldValue + " for element " + fieldValueElement.locator();
        expect(await utilPage.fieldValue(fieldName).getText(), msg).contains(fieldValue);
    });

When(/^I select link - '(.*?)'$/,
    async function (link: string) {
        await waitClick(utilPage.linkOption(link));
    });

When(/^I switch back to the prancer site browser window$/, 
    async function(){
        await swithToPrancerBrowserWindow();
    });

    async function swithToPrancerBrowserWindow(){
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[0]);
            browser.ignoreSynchronization = false;
            await browser.waitForAngular();
            expect(await waitVisible(utilPage.body)).to.be.true;
        });
    };

Then(/^the uploaded file '(.*?)' is accessible$/,
    async function(logFile: string){
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[1]);

            browser.ignoreSynchronization = true;
            await browser.sleep(1000);
            expect(await browser.getCurrentUrl()).to.contain(logFile);
            await utils.screenshot(logFile+'-accessible.png');
            await browser.close();
        });
    });


Then(/^the '(.*?)' page is open$/,
    async function(page: string){
        expect(await browser.getCurrentUrl()).to.contain("/"+page);
    });

When(/^I select checkbox in row with text '(.*?)'$/,
    async function (text: string) {
        await waitClick(utilPage.checkboxInRowWithText(text));
    });

When(/^I select checkbox with text '(.*?)'$/,
    async function (text: string) {
        await waitClick(utilPage.checkboxWithText(text));
    });

Then(/^the '(.*?)' table is empty$/,
    async function (tableName: string) {
        await utils.screenCapture(tableName, "table-is-empty");
        if(utils.contains(tableName, "Return kit")) {
            expect(await utilPage.tableBodyRows.count()).to.be.lte(1);
        } else if (utils.contains(tableName, "Patient")) {
            expect(await utilPage.contentBodyRows.count()).to.be.equal(0);
        }
    });

When(/^I press the button with text '(.*?)'$/,
    async function(button:string){
        await waitClick(element(by.buttonText(button)));
    });

When(/^I select link with text '(.*?)'$/,
    async function(link:string){
        await waitClick(element(by.linkText(link)));
    });

When(/^I clear all filters (?:on the page|in the report)$/,
    async function(){
        await utilPage.clearFilters();
    });

When(/^I filter the '(.*?)' column for '(.*?)'/,
    async function (column: string, value: string) {
        this.filterValue = value;
        this.filterColumn = column;
        await utilPage.filterColumn(column, value);
    });

When(/^I filter the '(.*?)' column for kit ID returned from '(.*?)'/,
    async function(column: string, patientStatus){
        if(patientStatus === "Second dosing"){
            await utilPage.filterColumn(column, this.secondDoseKitID);
        }else if(patientStatus === "Randomization"){
            await utilPage.filterColumn(column, this.randomizeKitID);
        }
    });

Then(/^the column filters$/,
    async function(){
        expect(await utilPage.verifyFilteredColumn(this.filterColumn, this.filterValue)).to.be.true;
    });

When(/^I filter each column (?:in the report|on the page)$/, { timeout: 180 * 1000 },
    async function () {
        let result = {};
        let tableCount = await utilPage.tables.count();
        for (let i = 0; i < tableCount; i++) {
            let table: ElementFinder = utilPage.tables.get(i);
            let tableResult: {}[] = [];
            let columns: EAF = table.all(by.css("td"));
            let columnsLength: number = await table.all(by.css("tr")).get(0).all(by.css("th")).count();
            for(let columnIndex = 0; columnIndex < columnsLength; columnIndex++) {
                let filteredResult = await utilPage.filter(table, columnIndex);
                let json = { index: columnIndex, name:await columns.get(columnIndex).getText(), result: filteredResult };
                tableResult.push(json);
            }
            result[i] = tableResult;
        }

        this.filterResult = result;
    });

Then(/^each column filters$/,
    async function () {
        let result = true;
        let tables = Object.keys(this.filterResult);
        for (let i = 0; i < tables.length; i++) {
            let table = this.filterResult[tables[i]];
            for(let j = 0; j < table.length; j++) {
                let column = table[j]["result"];
                if(column.length === 0) continue;
                let test = column[0];
                for(let k = 1; k < column.length; k++) {
                    if(column[k] && column[k].indexOf(test) === -1) {
                        result = false;
                        await logger.debug("ERROR: Filtering failure for column "+table[j]["name"]+
                            " value: " + column[k] + " != " + test + " data: "+JSON.stringify(column) +
                            " result: " + result);
                    }
                }
            }
        }
        expect(result).to.be.true;
    });

When(/^I sort each column (?:in the report|on the page)$/,
    async function () {
        let sortResult: object[] = [];
        let tableCount: number = await utilPage.tables.count();
        for (let i = 0; i < tableCount; i++) {
            let table: ElementFinder = await utilPage.tables.get(i);
            let sorters: EAF = table.all(by.css("md-icon.md-sort-icon"));
            let count: number = await sorters.count();
            for(let i = 0; i < count; i++) {
                sortResult.push(await utilPage.sort(table, i));
            }
        }
        this.sortResult = sortResult;
    });

Then(/^each column sorts$/,
    async function () {
        await logger.debug("Then each column sorts: start");
        for(let i = 0; i < this.sortResult.length; i++) {
            if(this.sortResult[i].length == 0 || !this.sortResult[i][0]) continue;
            let result: boolean = await !!this.sortResult[i].reduce(async (memo, item) => {
                return memo && item >= memo && item
            });
            expect(result).to.be.true;
        }
    });

When(/^I press the tab with text '(.*?)'$/,
    async function(tab:string){
        await waitClick(utilPage.tabIdentifier(tab));
    });

Then(/^verify the options in the '(.*?)' dropdown$/,
    async function(dropDown:string, table: TableDefinition){
       await utilPage.verifyDropDownOptions(utilPage.dropdownWithText(dropDown), table);
    });

When(/^I upload file (\d+) - '(.*?)'$/,
    async function(fileNum: number, file: string){
        browser.setFileDetector(new remote.FileDetector());
        let fileName = process.cwd() + '/utils/uploads/' + file;
        fileNum = fileNum - 1;

        browser.ignoreSynchronization = true;
        await element.all(by.css('input[type="file"]')).get(fileNum).sendKeys(fileName);
        browser.ignoreSynchronization = false;
    }); 

When(/^I click the add file button$/,
    async function(){
        await waitClick(element(by.css('button[ng-click="ctrl.addFile()"]')));
    });

When(/^I press the partial link text '(.*?)'$/,
    async function(linkText: string){
        await waitClick(element(by.partialLinkText(linkText)));
    });

Then(/^the button with text '(.*?)' is disabled$/,
    async function(button:string){
         expect(await element(by.buttonText(button)).isEnabled()).to.be.false;
    });

Then(/^the pdf file '(.*?)' was downloaded successfully on chrome downloads$/,
    async function(fileName: string){
        await utils.openChromeDownloadsWindow();

        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[1]);
            browser.ignoreSynchronization = true;

            let links = element.all(by.deepCss('#file-link'));
            let count = await links.count();
            let validate = false;
            for(let i = 0; i < count; i++){
                let file = await waitText(links.get(i));
                if(file.indexOf(fileName) !== -1 && file.indexOf('pdf') !== -1 ){
                    logger.info(file);
                    await utils.screenshot('PDF-file-' + fileName + '-downloaded-successfully.png');

                    /* opens the pdf file and takes a screenshot of the contents */
                    await waitClick(links.get(i));
                    await browser.switchTo().window((await browser.getAllWindowHandles())[2]);
                    await waitVisible(utilPage.body);
                    await browser.sleep(3000);
                    await utils.screenshot(fileName + '-contents-displayed.png');
                    await browser.close();

                    await browser.switchTo().window(handles[1]);
                    await waitClick(element.all(by.deepCss('#remove')).get(i));
                    await browser.close();
                    validate = true;
                    break;
                }
            }
            expect(validate, fileName + " PDF file downloaded successfully").to.be.true;
            await browser.switchTo().window(handles[0]);
            browser.ignoreSynchronization = false;
        });
        await swithToPrancerBrowserWindow();
    });

Then(/^the csv file '(.*?)' was downloaded successfully on chrome downloads$/,
    async function(fileName: string){
        await utils.openChromeDownloadsWindow();

        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[1]);
            browser.ignoreSynchronization = true;

            let links = element.all(by.deepCss('#file-link'));
            let count = await links.count();
            let validate = false;
            for(let i = 0; i < count; i++){
                let file = await waitText(links.get(i));
                if(file.indexOf(fileName) !== -1 && file.indexOf('csv') !== -1 ){
                    expect(await waitText(links.get(i))).to.contain(fileName);
                    await utils.screenshot('CSV-file-' + fileName + '-downloaded-successfully.png');
                    await waitClick(element.all(by.deepCss('#remove')).get(i));
                    await browser.close();
                    validate = true;
                    break;
                }
            }
            expect(validate, fileName +" CSV file downloaded successfully").to.be.true;
            await browser.switchTo().window(handles[0]);
            browser.ignoreSynchronization = false;
        });
        await swithToPrancerBrowserWindow();
    });