import { browser, element, by, ExpectedConditions, EAF, EF } from './';
import { Process } from '../pages/';
import { ElementStatus } from './utils';
import { ensureDirSync } from 'fs-extra';
import { TableDefinition } from 'cucumber';
import { logger } from '../utils/logger';

import * as path from 'path';
import * as proc from 'child_process';

import { SelectorPage } from '../pages/other/selector/selector.page';

var fs = require('fs');

export async function screenshot(fileName: string) {
    await browser.waitForAngular();
    await browser.takeScreenshot().then(function (png) {
        try {
            ensureDirSync(path.resolve(browser.params.folderName));
        } catch (e) {
            //if(e.clode !== 'EEXIST') throw e;
        }
        let filelocation = browser.params.folderName + Date.now() + "." + fileName;
        logger.debug("screenshot: " + filelocation);
        let stream = fs.createWriteStream(filelocation);
        stream.write(new Buffer(png, 'base64'));
        stream.end();
    });
}

export async function screenCapture(...args: string[]): Promise<void> {
    let myString: string = "";
    for(let i = 0; i < args.length; i++) {
        let cur: string = args[i];
        cur = cur.replace(" ", "-");
        cur = cur.toLowerCase();
        if(i < (args.length - 1))
            myString += cur + "-";
        else
            myString += cur;
    }
    this.screenshot(myString + ".png");
}

export async function logStudy() {
    let ele = await element(by.xpath("//span[@title]"));
    await this.waitVisible(ele);
    await logger.debug("Current study: " + (await ele.getAttribute("title")));
}

/**
 * Waits for an element to be visible, and does a click on the element if visible.
 * If the element is not visible then a error message will be displayed.
 *
 * @param element the element that we implement the click on
 *       Example - await waitClick(element(by.linkText('reports')));
 * @param timeout a optional local timeout will be used instead of the default timeout to test
 * for the visiblity of the element we want to click on
 *       Example - no timeout await waitClick(ele);
 *       Example - with timeout await element(ele, 15000);
 * @param value a optional value param if this param is stated then this means that the element to be clicked
 * is a dropdown element and we handle this click in the waitForDropDownClick()
 *      Example - no value param await waitClick(ele)
 *      Example - yes value param await waitCick(ele, 15000, value);
 * @param workAround a optional workAround param is a function used in the waitForDropDownClick()
 * in the case that there needs to be more work done after the refresh of a failed drop down click
 * this function adds onto to the work around functionality in the catch block of the waitForDropDownClick()
 * (e.g. patient detail report: after a refresh you need to choose a patient in order for all the data
 * to be displayed in that report)
 *       Example - without workAround() - function workAround() = undefined
 *       Example - with workAround() - function workAround() => await waitClick(this.patient);
 */
export async function waitClick(element: EF, timeout?: number, value?: EF, workAround?: Function): Promise<void> {
    if(value !== undefined) return await waitForDropDownClick(element, value, workAround);

    try {
        let timerStart = browser.params.timerEnd = Date.now();
        logger.debug("waitClick: " + element.locator());
        let EC = ExpectedConditions;
        await browser.wait(await EC.elementToBeClickable(element), timeout? timeout : browser.params.timeout);
        await browser.sleep(500);
        await element.click();
        let betweenTime = (browser.params.timerEnd-browser.params.timerStart)/1000;
        let timerEnd = browser.params.timerStart = Date.now();
        await logger.debug("found element and clicked in " + (timerEnd-timerStart)/1000 + " seconds (" + betweenTime + ")");
    } catch (e) {
        throw new Error("Failed to waitClick " + element.locator() + "\n" + e.message);
    }
}

/**
 * This function is only used in the waitClick()
 *
 * Handles a drop down click. When we click on the drop down button we check to see if a value inside the 
 * drop down is visible. If a value is not visible this means the drop down failed to not open fully, and catch this 
 * error. The workaround implements a refresh on the page, clicks on the drop down button again, and checks to see
 * if the element is visible. This function loops 5x, and if the loop runs through all the iterations then a error 
 * will display informing us what drop down failed to open successfully.
 *
 * @param dropDownButton the drop down buttton we want to click on
 * @param value the value we use to check to see if the drop down successfully opens or not
 * @param workAround A optional param used as a function. this function provides more steps if needed to the
 * work around after the refresh for special cases: selecting a patient, selecting a site, inputing data, etc...
 *
 */
async function waitForDropDownClick(dropDownButton: EF, value: EF, workAround?: Function): Promise<void> {
    await waitClick(dropDownButton);

    for(let i = 0; i < 5; i++){
        try{
            await waitVisible(value, 15000);
            return;
        }catch(e){
            logger.debug(dropDownButton.locator() + " :failed to full open drop down reclicking...");
            await refresh();
            if(workAround !== undefined) await workAround();
            await waitClick(dropDownButton);
        }
    }

    throw new Error("Failed to waitClick " + dropDownButton.locator() + "\n");
}

export async function waitClickable(element: EF, timeout?: number): Promise<void> {
    try {
        let timerStart = browser.params.timerEnd = Date.now();
        logger.debug("waitClickable: " + element.locator());
        let EC = ExpectedConditions;
        await browser.wait(await EC.elementToBeClickable(element), timeout? timeout : browser.params.timeout);
        let betweenTime = (browser.params.timerEnd-browser.params.timerStart)/1000;
        let timerEnd = browser.params.timerStart = Date.now();
        await logger.debug("found element clickable in " + (timerEnd-timerStart)/1000 + " seconds (" + betweenTime + ")");
    } catch (e) {
        throw new Error("Failed to waitClickable " + element.locator() + "\n" + e.message);
    }
}

export async function waitVisible(element: EF, timeout?: number): Promise<boolean> {
    try {
        let timerStart = browser.params.timerEnd = Date.now();
        await logger.debug("waitVisibile: " + element.locator());
        await browser.wait(await ExpectedConditions.visibilityOf(element), timeout? timeout : browser.params.timeout);
        let betweenTime = (browser.params.timerEnd-browser.params.timerStart)/1000;
        let timerEnd = browser.params.timerStart = Date.now();
        await logger.debug("found element visible in " + (timerEnd-timerStart)/1000 + " seconds (" + betweenTime + ")");
        return true;
    } catch (e) {
        throw new Error("Failed to waitVisible " + element.locator() + "\n" + e.message);
    }
}

export async function waitText(element: EF): Promise<string> {
    try {
        let timerStart = browser.params.timerEnd = Date.now();
        await logger.debug("text: " + element.locator());
        let EC = ExpectedConditions;
        await browser.wait(await EC.visibilityOf(element), browser.params.timeout);
        let text: string = await element.getText();
        let betweenTime = (browser.params.timerEnd-browser.params.timerStart)/1000;
        let timerEnd = browser.params.timerStart = Date.now();
        await logger.debug("found element text '" + text + "' in " + (timerEnd-timerStart)/1000 + " seconds (" + betweenTime + ")");
        return text;
    } catch (e) {
        throw new Error("Failed to waitText " + element.locator() + "\n" + e.message);
    }
}

export async function refresh() {
    logger.debug("utils.refresh()");
    let selectorPage = new SelectorPage();
    await browser.driver.navigate().refresh();
    await selectorPage.handleSelectorPage(browser.params.study, browser.params.site);
}

export function contains(first:string, second:string) {
    return first.indexOf(second) !== -1;
}

export async function getElementByText(text: string, array: EAF): Promise<EF> {
    let results: Array<EF> = await getArrayAsElements(array);
    for(let element of results) {
        if(this.contains(await this.waitText(element), text)) {
            return element;
        }
    }
}

export async function getArrayAsElements(array: EAF): Promise<Array<EF>> {
    return await array.asElementFinders_();
}

/**
 * Formats the current date to reflect date format in project
 */
export function getCurrentDate(): string {
            let ts = new Date();
            var date = ts.toDateString();
            var dateArr = date.split(" ");
            return (dateArr[2] + '-' + dateArr[1] + "-" + dateArr[3]);
}

export function getReportName(id:string): string {
    let name: string = id.split(" ").join("-");
    let lowercase: string  = name.toLocaleLowerCase();
    return lowercase;
}

export function tableToJson(td: TableDefinition): {}[] {
    let table = td.hashes();
    let result = [];

    for(let i = 0; i < table.length; i++) {
        let entry = {};
        for(let propName in table[i]) {
            let propValue = table[i][propName];
            if(propValue === 'true' || propValue === 'false') {
                entry[propName] = JSON.parse(propValue);
            }
            else if (propValue.indexOf(" or ") !== -1){
                entry[propName] = propValue;
            }
            else if (propValue.match(/(.*?)-(.*?)-(.*?)/)){
                entry[propName] = propValue;
            }
            else if (!isNaN(parseInt(propValue))) {
                entry[propName] = parseInt(propValue);
            }
            else {
                entry[propName] = propValue;
            }
        }
        result.push(entry);
    }
    logger.debug("utils.tableToJson: " + JSON.stringify(result, null, 2));
    return result;
}

export function tableToJsonStrObj(td: TableDefinition): {} {
    let table = td.hashes();
    let result = {};
    let values = [];
    let keys = Object.keys(table[0]);
    
    for(let i in keys){
        for( let entry of table){
            values.push(entry[keys[i]]);
        }
        result[keys[i]] = values;
        values = [];
    }
    
    logger.debug("utils.tableToJsonStrObj: " + JSON.stringify(result, null, 2));
    return result;
}

export async function firstElement(eleA: EF, eleB: EF, timeoutInput?: number): Promise<EF> {
    let timeout = browser.params.timeout;
    if(timeoutInput) timeout = timeoutInput;
    await browser.sleep(2000);
    let waitTime = 2000;
    while(timeout >= 0) {
        if(await eleA.isPresent()) { await logger.debug("firstElement: returning A"); return eleA; }
        if(await eleB.isPresent()) { await logger.debug("firstElement: returning B"); return eleB; }
        await browser.sleep(waitTime);
        timeout -= waitTime;
    }
    throw Error("ERROR: utils.firstElement timedout out without finding elements "+eleA.locator().toString()+" or "+eleB.locator().toString());
}

export interface ElementStatus {
    present: boolean,
    displayed: boolean,
    enabled: boolean
}

export async function status(someEle: EF): Promise<ElementStatus> {
    logger.debug("Status: start: " + someEle.locator());

    let result: ElementStatus = {
        present: false,
        displayed: false,
        enabled: false
    }

    result.present = await someEle.isPresent();
    if(result.present) {
        result.displayed = await someEle.isDisplayed();
        result.enabled = await someEle.isEnabled();
    }

    logger.debug("Status: result: " + JSON.stringify(result));

    
    return result;
}

export async function clickDateLink(parentEle?:EF) {
    let date: string = getCurrentDate();
    let dateLink: EF = parentEle ? parentEle.all(by.partialLinkText(date)).first() : element.all(by.partialLinkText(date)).first()
    await waitClick(dateLink);
}

export async function isFileSync(aPath) {
    logger.debug("file is present: " + fs.statSync(aPath).isFile());
    return fs.statSync(aPath).isFile();
}

export async function processCommand(command: string): Promise<void> {
    await proc.exec(command, (err, stdout, stderr) => {
        logger.info("ERR: " + err);
        logger.info("STDOUT: " + stdout);
        logger.info("STDERR: " + stderr);
    });
}

export async function run(p: Process, recover: () => Promise<void>): Promise<void> {
    for(let i = 0; i < 3; i++) {
        try {
            await p.run();
            return;
        } catch (e) {
            await screenshot("run-"+i+"-failure-page-state.png");
            await logger.debug("EXCEPTION: " + e.message);
            await logger.debug("run process " + Object.keys(p) + " failed on try " + i + ", trying again...");
            await recover();
        }
    }
}

export function isNumberArray(strArr:any[]): boolean {
    return !isNaN(strArr[0]);
}

//A overloaded function that verifys if an array is sorted least -> greatest
export function verifySortedArray(arr: any[]): boolean {
    let resultCounter = 0;

    for(let i = 0; i < arr.length-1; i++){
        if(arr[i] == arr[i+1]) continue;
        else if(arr[i] > arr[i+1]){
            logger.debug("verifySortedArray(): not sorted from least to greatest "+ arr[i] + " is greater than " + arr[i+1]);
            resultCounter++;
        }
    }
    return (resultCounter === 0);
 }

 export async function isAttributePresent(element: EF, attribute: string): Promise<boolean>{
    let result: boolean = false;
    try {
        let value: string = await element.getAttribute(attribute);
        if (value != null){
            result = true;
        }
    } catch (e) {
        logger.debug(attribute + " is not an attribute of the element " + element.locator());
    }

    return result;
}

/* switch to chrome downloads browser for validating downloadable files */
export async function openChromeDownloadsWindow(): Promise<void> {
    await browser.executeScript('window.open()')
        await browser.getAllWindowHandles().then(async function (handles) {
            await browser.switchTo().window(handles[1]);
            browser.ignoreSynchronization = true;
            await browser.get('chrome://downloads/');
            
            /* validates that page is open and at least one download is displayed */
            await waitVisible(element(by.css('body')));
            await browser.wait(() => {
                return browser.executeScript('return downloads.Manager.get().items_.length > 0 && downloads.Manager.get().items_[0].state === "COMPLETE"');
            }, 600000, `"downloads.Manager.get().items_" did not have length > 0 and/or item[0].state did not === "COMPLETE" within ${600000/1000} seconds`);
            browser.ignoreSynchronization = false;
        });
}