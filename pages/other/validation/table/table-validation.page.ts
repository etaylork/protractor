import { by, element, ElementFinder, ElementArrayFinder } from 'protractor';
import { logger, utils } from '../../../../utils';

import { Validation } from '../validation.page';
import { waitText } from '../../..';

import { UtilPage } from '../../../../pages/other/util.page';

const utilPage: UtilPage = new UtilPage();

export class TableValidation extends Validation {

    static containsDataMessage = (table: ElementFinder, data: string[][]) =>
        "TableValidation.containsData: '" + table.locator() + "' data " + JSON.stringify(data);
    static validateTableMessage = (table: ElementFinder, data: {}) =>
        "TableValidation.validateTable: '" + table.locator() + "' data " + JSON.stringify(data);
    static validateColumnMessage = (data: string[]) =>
        "TableValidation.validateColumn: start" + (data ? (": data: " + JSON.stringify(data)) : "");

    /**
     * Takes as input an array in the format ["header1", "header2", "header3"]
     */
    static containsColumns = async (table: ElementFinder, data: string[]): Promise<boolean> => {
        logger.debug("TableValidation: containsColumns: start: data: " + JSON.stringify(data, null, 2));

        let byText = (ele: ElementFinder, text: string) => ele.all(by.css("thead")).get(0).all(by.cssContainingText("th", text)).first();
        let dataResult = true;      

        for (let name of data) {
            let myEle: ElementFinder;
            try {
                myEle = await byText(table, name);
                await myEle.isDisplayed();
            } catch (e) {
                logger.debug("ERROR: TableValidation: containsColumns: could not find " + name + " with locator " + myEle.locator());
                dataResult = false;
            }
        }

        if(!dataResult) {
            throw Error("ERROR: TableValidation: containsColumns");
        }

        return dataResult;
    }

    /**
     * Takes as input a multi-dimensional array and validates the data in a table with it,
     * data format is [["row1-entry1","row1-entry2"], ["row2-entry1","row2-entry2"]]
     */
    static containsData = async (table: ElementFinder, data: string[][]): Promise<boolean> => {
        logger.debug(TableValidation.containsDataMessage(table, data));

        let entryElement = (row: number, column: number): ElementFinder => 
            table.element(by.css("tr:nth-child("+(++row)+") > td:nth-child("+(++column)+")"));

        let dataResult = true;

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                let result = data[i][j];
                let entry = await entryElement(i, j).getText();
                if(Validation.containsText(entry, result)) {
                    logger.debug("ERROR: TableValidation: containsData: result=" + result + " did not match entry=" + entry+ " at index i: " + i + " j: " + j);
                    dataResult = false;
                }
            }
        }

        if(!dataResult) {
            throw Error("ERROR: TableValidation: containsData");
        }

        return dataResult;
    }

    /**
     * Validates a table including columns and rows
     * @param table specifies which table to use in case there are multiple on a page
     * @param data specifies all required data including column headers and row entries
     *      Example
     *  let data = {
     *      "Column 1 Header Name": [
     *          "row1entry1",
     *          "row2entry1"
     *      ],
     *      "Column 2 Header Name": [
     *          "row1entry2",
     *          "row2entry2"
     *      ]
     *  }
     */
    static validateTable = async (table: ElementFinder, data: {}): Promise<boolean> => {
        await logger.debug(TableValidation.validateTableMessage(table, data));

        let columns = Object.keys(data);
        let result: boolean = await TableValidation.containsColumns(table, columns);

        let rows: ElementArrayFinder = table.all(by.css("tbody tr"));

        let getText = async (ele: ElementFinder): Promise<string> => await ele.getText();
        let hasEntry = async (tableValue: string, dataValue: string): Promise<boolean> => {
            await logger.debug("validateTable: compare: dataValue="+dataValue+" tableValue="+tableValue);
            if (dataValue.indexOf('"') === 0 && utils.contains(dataValue, "/")) {
                let vals: string[] = tableValue.replace(/['"]+/g, '').split("/");
                return await Validation.containsText(vals[0], tableValue)
                    || await Validation.containsText(vals[1], tableValue);
            } else 
                return await Validation.containsText(dataValue, tableValue);
        }

        for(let index in Object.keys(data)) {
            result = result && await TableValidation.validateColumn(rows, Number(index), hasEntry, getText, data[columns[index]]);
        }
        return result;
    }

    /**
     * Validate column function uses an array of rows and an index to traverse down the rows
     * validating the entries as it goes. It uses two provided functions, getValue which lets
     * you preprocess the data you will evaluate (multiple data per entry, number to str, etc...)
     * and evaluate which allows you to pass a custom evaluator. If the optional 'data' parameter
     * is not passed then the evaluation will be called as 'evaluate(someElement.getValue(index))'.
     * If data is passed then the evaluation will be 'evaluate(elementA.getValue(index), data[index])
     * and either version must return a boolean value.
     *
     * @param rows all of the 'body tr' elements that will be searched
     *      Example - element.all(by.css('table tbody tr'));
     * @param index indicates which column will be tested
     * @param evaluate takes a value to test, if the data param exists then it will
     * test against the same value in the data, otherwise it can do a simple validation
     * such as 'is greater than 0'
     *      Example without data - let eval = (value: string) => Number(value) >= 0;
     *      Example with data - let eval = (value: string, data: string) => value.indexOf(data) !== -1;
     * @param getValue this abstraction allows the user to specify how data is retrieved
     * because sometimes there is extra processing that needs to be done before testing occurs
     *      Example - let getValue = (ele: ElementFinder) => (await ele.getText()).replace(" ", "-");
     * @param data is an array of values to test the read values against
     *      Example - let columnData = ["entry1","entry2","etc..."];
     */
    static validateColumn = async function (rows: ElementArrayFinder, index: number,
        evaluate: (value: string, data?: string) => Promise<boolean>,
        getValue: (ele: ElementFinder) => Promise<string>, data?: string[]): Promise<boolean>
    {
        await logger.debug(TableValidation.validateColumnMessage(data));

        let count = data ? data.length : await rows.count();
        let dataResult = true;
        for(let i = 0; i < count; i++) {
            if (data && !data[i]) continue;
            let value: string = await getValue(rows.get(i).all(by.css("td")).get(index));
            let result: boolean = data
                ? await evaluate(value, data[i])
                : await evaluate(value);
            if(!result) {
                await logger.error("ERROR: validateColumn: bad evaluation on row " + i + " data: " + data + " value: " + value);
                dataResult = false;
            }
        }
        return dataResult;
    }

    /**
     * validate a columns data in descending order
     * takes in two params
     * @param rows - takes in all rows in the table
     * @param index - takes in the column index on the table to get the data value in each row
     *
     * Validates a columns data in order from least to greatest
     * and check for two options to compare values in the table
     *
     * if data in column is a number
     *       converts the string to a number and compare number values
     * else
     *      compare the data as string values
     *
     * Example: Patient column that is in order from least to greatest
     *          Patients: [ QASR0001
     *                      QASR0002
     *                      QASR0003
     *                      QASR0004 ]
     **/
    static validateColumnDataDESC = async function(rows: ElementArrayFinder, index: number): Promise<boolean> {
        let data = [];
        let count: number = await rows.count();
        let dataResult: number = 0;

        for(let i = 0; i < count; i++)
             data.push(await waitText(rows.get(i).all(by.css("td")).get(index)));

        for(let j = 0; j < data.length-1; j++){

            if(!isNaN(data[j]) && Number(data[j]) > Number(data[j+1]) ){
                logger.debug("validateColumnDataDesc: column data not in desceding order" + data[j] + " > " + data[j+1] );
                dataResult++;
            }else if(data[j] > data[j+1]){
                logger.debug("validateColumnDataDesc: column data not in desceding order" + data[j] + " > " + data[j+1] );
                dataResult++;
            }
        }

        return (dataResult == 0);
    }

    /**
     * Tests for a set of value's presence in table, no particular ordering is enforced
     */
    static containsEntries = async function (data: {}, skip: boolean = false) {
        let result = false;
        for(let key of Object.keys(data)) {
            let thElements: ElementFinder = element.all(by.css("thead")).get(0).all(by.css("tr")).get(0);
            let eleIndex: number = await TableValidation.getIndexInRow(thElements, key, "th");
            let rowCount: number = await element.all(by.css('tbody tr')).count();
            for(let i = 0; i < rowCount; i++){
                let row = await element.all(by.css('tbody tr')).get(i)
                let entry = await row.all(by.css('td')).get(eleIndex);
                let text = await entry.getText();
                if((await Validation.containsText(String(data[key]), text))) result = true;
            }

            await logger.debug("ERROR: Failed to match data: " + data[key] + " and values in the table");
        }
        if(!result && !skip) {
            throw Error("ERROR: TableValidation: containsEntries");
        }
        return result;
    }

    static doesNotContainEntries = async function (data: {}, skip: boolean = false): Promise<boolean> {
        let result: boolean;
        let rows: ElementArrayFinder = utilPage.tableBodyRows;
        let count: number = await rows.count();
        for(let i = 0; i < count; i++) {
            let row: ElementFinder = utilPage.rowByIndex(i);
            let cols: ElementArrayFinder = row.all(by.xpath(".//td"));
            let colCount: number = await cols.count();
            for(let j = 0; j < colCount; j++) {
                let key: string = Object.keys(data)[j];
                let expect: string = data[key];
                let actual: string = await waitText(utilPage.colsByIndex(i,j));
                await logger.debug("TableValidation.doesNotContainEntries: expect=" + expect + " actual=" + actual);
                if(!await Validation.containsText(expect, actual)) {
                    await logger.debug("TableValidation.doesNotContainEntries: no match");
                    break;
                }
                if(Validation.containsText(expect, actual) && j == colCount - 1) {
                    await logger.debug("TableValidation.doesNotContainEntries: matched! result: false" + JSON.stringify(data, null, 2));
                    return false;
                }
            }
        }
        logger.debug("TableValidation.doesNotContainEntries: result: true");
        return true;
    }
    /**
     * Changes a table element. First identifies the target row using a string column header called 'locHeaderId' such as
     * "MyColumnHeader1", and an entry in that column called 'locValueId' such as "MyColumn1EntryForRow3" which would give
     * row 3. Then identifies the index in that row using a second column header named 'targetHeader' such as "MyColumnHeader4"
     * which would then specify row 4 of column 3. Then passes that 'column 3 row 4' element locator to a custome/provided
     * function that can manipulate that element however it wants (pick from dropdown, enter value, etc...).
     *
     * @param {ElementFinder} table specifies which table on a page to use
     * @param {string} locHeaderId specifies a column
     * @param {string} locValueId specifies a value
     *      Combined locHeaderId and locValueId specify a particular row in the table
     * @param {string} targetHeader specifies a column in the previously identified row which gives us a target element
     * @param {({ElementFinder}) => Promise<void>} targetFunction this function is executed on the target
     *      element and is used to modify it in some way
     */
    static setValue = async function (table: ElementFinder, locHeaderId: string, locValueId: string,
        targetHeader: string, targetFunction: (target: ElementFinder) => Promise<void>): Promise<void> {
            let headerRow: ElementFinder = table.all(by.css("thead")).get(0).all(by.css("tr")).get(0);
            let locIndex: number = await TableValidation.getIndexInRow(headerRow, locHeaderId, "th");
            let rows: ElementArrayFinder = table.all(by.xpath(".//tbody//tr"));
            let rowIndex: number = await TableValidation.getRowFromIndex(rows, locIndex, locValueId);
            let targetIndex: number = await TableValidation.getIndexInRow(headerRow, targetHeader, "th");
            let target: ElementFinder = table.all(by.css("tbody tr")).get(rowIndex-1).all(by.css("td")).get(targetIndex);
            await targetFunction(target);
    }

    static getIndexInRow = async function (row: ElementFinder, value: string, type: string): Promise<number> {
        let entries = row.all(by.xpath(".//"+type));
        if(!value) return -1;
        let count = await entries.count();
        for(let i = 0; i < count; i++) {
            let entry = entries.get(i);
            let text = await entry.getText();
            if(text !== "" && await Validation.containsText(text, value)) {
                return i;
            }
        }
        throw Error("ERROR: Could not find value " + value + " in row " + await row.locator());
    }

    private static getRowFromIndex = async function (rows: ElementArrayFinder, index: number, value: string): Promise<number> {
        let rowsCount: number = await rows.count();
        for(let i = 0; i < rowsCount; i++) {
            let elementExistsInRow: boolean = await rows.get(i)
                .element(by.xpath("(.//td)["+index+"][contains(text(),'"+value+"')]"))
                .isPresent();
            if(elementExistsInRow) {
                return i;
            }
        }
        return -1;
    }

    static getValue = async function (columnName: string, rowIndex: number) {
        let headRow: ElementFinder = element(by.css("thead tr"));
        let columnIndex: number = await this.getIndexInRow(headRow, columnName, "th");
        let row: ElementFinder = element(by.xpath("(//tbody//tr)[" + (rowIndex+1) + "]"));
        return await row.element(by.xpath("(//td)[" + (columnIndex+1) + "]")).getText();
    }

    static containsOneOf = async function (table: ElementFinder, data: {}) {
        let keys: string[] = Object.keys(data);
        let numEntries: number = data[keys[0]].length;
        let result: boolean = false;
        for(let i = 0; i < numEntries; i++) {
            let singleData: {} = {};
            for(let j = 0; j < keys.length; j++) {
                singleData[keys[j]] = [data[keys[j]][i]];
            }
            result = result || await this.validateTable(table, singleData);
        }
        return result;
    }

}