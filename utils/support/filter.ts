import { browser, by, EAF, EF, element, Key, logger, Page, utils, waitClick, waitText } from '../';
import { SelectorPage } from '../../pages/other/selector/selector.page';

const selectorPage: SelectorPage = new SelectorPage();

/**
 * 
 * @param table encapsulating table element that limits our element search scope on a per table basis
 * @param columnIndex the index of the column that is currently being filtered
 */
let getResults = async (table: EF, columnIndex: number): Promise<string[]> => {
    let screenshotName = columnIndex+"-filtered.png";
    await utils.screenshot(screenshotName);

    let result = [];
    let rows = table.all(by.css("tbody tr"));
    let rowCount: number = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        let row = rows.get(i);
        let ele = await row.all(by.css("td")).get(columnIndex);
        let str = await waitText(ele);
        result.push(str);
    }
    return result;
};

/**
 * For single dropdown filters this function saves the original state of the options
 * and selects a given option based on a string value
 */
let selectRecordState: (value: string) => Promise<any[]> = async (value: string) => {
    let options: EAF = element.all(by.css(".md-active .md-checkbox-enabled[selected]"));
    let numOptions: number = await options.count();
    let state: string[] = [];
    // if no options selected just click our option and go
    if(numOptions === 0) {
        await waitClick(element(by.cssContainingText(".md-active .md-checkbox-enabled", value)));
        return [value];
    }
    for(let i = 0; i < numOptions; i++) {
        let e: EF = await options.get(i);
        let text: string = await e.getText();
        if(text.indexOf(value) === -1) {
            state.push(text);
            await waitClick(e);
            i--;
            numOptions = await options.count();
        }
    }
    return state;
};

/**
 * For a single dropdown filter this function resets the state of the options checkboxes
 * to what they original were
 */
let resetState: (state: string[]) => Promise<void> = async (state: string[]) => {
    for(let i = 0; i < state.length; i++) {
        let e: EF = element(by.cssContainingText(".md-active .md-checkbox-enabled", state[i]));
        await waitClick(e);
    }
};

/**
 * Gets a value that exists in the column as an example value to filter on (when a value is not provided)
 * @param table encapsulating table element that limits our element search scope on a per table basis
 * @param index the index of the column that is currently being filtered
 */
let text: (table: EF, index: number) => Promise<string> = async (table: EF, index: number) => {
        let rows: EAF = table.all(by.css("tbody tr"));
        let count: number = await rows.count();
        for(let i = 0; i < count; i++) {
            let value = await rows.get(i).all(by.css("td")).get(index).getText();
            if (value) return value;
        }
        return "";
    }

/**
 * In the case of a single input this function will enter the value argument, record the results,
 * clear the filter value and return the recorded results.
 * @param table encapsulating table element that limits our element search scope on a per table basis
 * @param inputFilter the inputFilter we are using to filter the table on
 * @param value the string that is used to filter the table on
 * @param columnIndex the index of the column that is currently being filtered
 */
let handleInputFilter: (table:EF , inputFilter: EF, value: string, columnIndex: number) =>
        Promise<string[]> = async (table:EF , inputFilter: EF, value: string, columnIndex: number) => {

    let result: string[] = []
    await browser.actions().mouseMove(inputFilter).perform();
    await inputFilter.clear();
    await inputFilter.sendKeys(value);
    result = await getResults(table, columnIndex);
    await inputFilter.clear();
    return result;
};

/**
 * In the case that the filter has double inputs we assume that it is a date range. We will get the current
 * date from the utilities functions, enter that, record the results, clear the inputs, and then return the
 * recorded results. Function strips the time from the results for comparison purposes.
 * @param table encapsulating table element that limits our element search scope on a per table basis
 * @param inputFilters the inputFilter we are using to filter the table on
 * @param value the string that is used to filter the table on
 * @param columnIndex the index of the column that is currently being filtered
 */
let handleDoubleInputFilters: (table: EF, inputFilters: EAF, columnIndex: number, value: string) =>
        Promise<string[]> = async (table: EF, inputFilters: EAF, columnIndex: number, value: string) => {

    await logger.debug("Filter.handleDoubleDropdown: start: value: " + value);
    let count: number = await inputFilters.count();

    for(let i = 0; i < count; i++) {
        let inputFilter: EF = inputFilters.get(i);
        let date = utils.getCurrentDate();
        await inputFilter.clear();
        await inputFilter.sendKeys(date);
    }

    await utils.screenshot(value + "-filtered.png");
    let result = (await getResults(table, columnIndex))
        .map(k => k.split(" ")[0]);

    for(let i = 0; i < count; i++) {
        let inputFilter: EF = inputFilters.get(i);
        await inputFilter.clear();
    }

    await logger.debug("Filter.handleSingleDropdown: finish");
    return result;
};

/**
 * In the case that the filter has a single dropdown we will open the passed dropdown filter, if this click fails
 * due to the click bug in protractor it will try again, when the options are displayed the selected options are
 * are stored into a string array so that the state can be reset after it's worked on. The function then goes
 * through each of the selected values and as long as it is not the value we want selected, it will unselect that
 * value. Then it records the results. Next it uses the string array to select and unselect all the options
 * in accordance with the previously saved state. Finally it returns a string array of the results.
 * @param table encapsulating table element that limits our element search scope on a per table basis
 * @param dropdownFilter the inputFilter we are using to filter the table on
 * @param value the string that is used to filter the table on
 * @param columnIndex the index of the column that is currently being filtered
 */
let handleSingleDropdown: (table: EF, dropdownFilter: EF, columnIndex: number, value: string) =>
        Promise<string[]> = async (table: EF, dropdownFilter: EF, columnIndex: number, value: string) => {

    await logger.debug("Filter.handleSingleDropdown: start: value: " + value);
    let state: string[] = [];

    await waitClick(dropdownFilter);

    try{
        //await waitClickable(value(filterData), 20000);
        state = await selectRecordState(value);
    } catch (e){
        await utils.screenshot('failed-type-dropdown-click.png');
        logger.warn("click failure, couldn't find option " + value + " trying again....");
        await browser.refresh();
        await selectorPage.selectStudyByName(browser.params.study);
        await selectorPage.submit();
        await waitClick(dropdownFilter);
        state = await selectRecordState(value);
    }
    let result = await getResults(table, columnIndex);
    await resetState(state);
    await browser.actions().sendKeys(Key.ESCAPE).perform();
    await logger.debug("Filter.handleSingleDropdown: finish");
    return result;
};

export class Filter extends Page {
    /**
     * This function takes as input a target table, target column in the form of an index, and an optional
     * value on which to filter. It can handle single input filters, double input filters (dates), and
     * dropdowns. It returns a string array with the column values that result from the application of the
     * filter.
     * @param table encapsulating table element that limits our element search scope on a per table basis
     * @param columnIndex the index of the column that is currently being filtered
     * @param suppliedValue an optional value to filter on, in that case that no value is provided then the
     * target column is recussively searched for a valid value to use. If no valid value is found then an empty
     * array is returned.
     */
    static async column(table: EF, columnIndex: number, suppliedValue?: string): Promise<{}[]> {
        let column: EF = table.all(by.css("tr")).get(0).all(by.css("th")).get(columnIndex);
        let name: string = await column.getText();

        let value: string = suppliedValue ? suppliedValue: await text(table, columnIndex);

        if(!value) return [];

        let filter: EF = table.all(by.css("thead tr")).get(1).all(by.css("th")).get(columnIndex);
        let inputFilters: EAF = filter.all(by.css("input"));
        let dropdownFilter: EF = filter.element(by.css("md-select"));
        let inputFilterCount: number = await inputFilters.count();

        let result = [];

        if (inputFilterCount === 1)
            result = await handleInputFilter(table, inputFilters.first(), value, columnIndex);
        else if (inputFilterCount === 2)
            result = await handleDoubleInputFilters(table, inputFilters, columnIndex, value);
        else if (await dropdownFilter.isPresent())
            result = []; //await handleSingleDropdown(table, dropdownFilter, columnIndex, value);
        else {
            logger.debug("Report.filter: element is not filterable at columnIndex:" + columnIndex + " name: " + name);
            result = [];
        }

        return result;
    }
}