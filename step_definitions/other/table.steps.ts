import { ElementFinder, expect, utils} from '../../utils';
import { TableValidation } from '../../pages';

const { Then } = require("cucumber");

Then(/^'(.*?)' column contains links$/,
    async function (targetHeader: string) {
        let r = this.report;
        let index: number = await TableValidation.getIndexInRow(r.tableHeaderRow, targetHeader, "th");
        let getValue: (e: ElementFinder) => Promise<string> = async (ele: ElementFinder) => 
                await ele.getAttribute("innerHTML");
        let evaluate: (str: string) => Promise<boolean> = async (str: string) =>
                str.indexOf("<a") !== -1;
        let result: boolean = await TableValidation.validateColumn(r.tableBodyRows, index, evaluate, getValue);
        expect(result).to.be.true;
    });

Then(/^'(.*?)' column contains entry '(.*?)'(?: or '(.*?)')?$/,
    async function (columnName: string, columnValue: string, alternateValue: string) {
        let actualString: string = await TableValidation.getValue(columnName, 0);

        if(utils.contains(actualString, columnValue)) {
            expect(actualString).equals(columnValue);
        } else if (utils.contains(actualString, alternateValue)) {
            expect(actualString).equals(alternateValue);
        } else {
            expect(actualString).equals("failed to match " + columnValue + " or " + alternateValue);
        }
    });