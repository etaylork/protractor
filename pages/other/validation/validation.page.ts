import { ElementFinder } from 'protractor';
import { logger, utils } from '../../../utils';

export class Validation {

    static async containsTextInArray( stringValues: string, testValue:string){
        let stringArr: string[] = stringValues.split(" or ");
        for(let i = 0; i < stringArr.length; i++){
            if(stringArr[i].indexOf(testValue) !== -1 ){
                return true;
            }
        }
        return false;
    }

    static async containsText(textA: string, textB: string): Promise<boolean> {
        await logger.debug("Validation.containsText: '" + textA + "' / '" + textB + "'");
        if(textA == "") return true;
        if(textB === undefined || textB == "") return false;
        if(textA.indexOf(" or ") !== -1){
            return this.containsTextInArray(textA, textB);
        }else if(textB.indexOf(" or ") !== -1){
            return this.containsTextInArray(textB, textA);
        }
        if(textA == "") return true;
        if(textB === undefined || textB == "") return false;
        return textB.indexOf(textA) !== -1 && textB.length === textA.length;
    }


    static async elementEquals(eleA: ElementFinder, eleB: ElementFinder) {
        let locatorA: string = await eleA.locator().toString();
        let locatorB: string = await eleB.locator().toString();
        return Validation.containsText(locatorA, locatorB);
    }

    static async date(expected: string, actual: string): Promise<boolean> {
        let months: string[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let d: Date = new Date();
        let expectStr: string;
        if (utils.contains(expected, "in") && utils.contains(expected, "days")) {
            d.setDate(d.getDate() + Number(expected.split("in ")[1].split(" days")[0]));
        }
        expectStr = d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear();
        logger.debug("Validation.date: expected: " + expected + " expect: " + expectStr + " actual: " + actual);
        return utils.contains(actual, expectStr);
    }
}