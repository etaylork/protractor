import { by, ele, EF, EAF, EFNumFunc, EFStrFunc, Err, Filter, waitText, waitClick, strToNumArray, utils, logger, TableDefinition, waitVisible, browser } from '../utils';

export abstract class Page {

    /* page elements */
    body: EF = ele(by.css("body"));
    cancelButton: EF = ele(by.buttonText("Cancel"));
    confirmButton: EF = ele(by.buttonText("Confirm"));
    backButton: EF = ele(by.buttonText("Back"));
    nextButton: EF = ele(by.buttonText("Next"));
    reviewPageNextButton: EF = ele.all(by.buttonText('Next')).get(1);
    submitButton: EF = ele(by.buttonText("Submit"));
    table: EF = ele.all(by.css("table")).first();
    tables: EAF = ele.all(by.css('table.md-table.ng-isolate-scope'));
    tbody: EF = ele(by.css("tbody"));
    tfoot: EF = ele(by.css("tfoot"));
    content: EF = ele(by.css("md-content"));
    contentBodyRows: EAF = this.content.all(by.css("tbody tr"));
    tableBodyRows: EAF = this.table.all(by.css("tbody tr"));
    tableHeaderRows: EAF = this.table.all(by.css("thead tr"));
    tableHeaderRow: EF = this.tableHeaderRows.get(0);
    nextArrowButtons: EAF = ele.all(by.css('button[ng-click="$pagination.next()"]'));
    columnFilters: EAF = ele.all(by.model("ctrl.inputFilters[path]"));

    buttonIdentifier: EFStrFunc = (text: string) => ele.all(by.buttonText(text)).last();
    field: EFStrFunc = (action: string) => ele(by.xpath("//*[@label='field.desc']//text()[contains(.,'" + action + "')]"));
    fieldElement: EFStrFunc = (action: string) => ele(by.xpath("//*[@label='field.desc']//*[contains(text(),'" + action + "')]"));
    fieldValue: EFStrFunc = (fieldName: string) => this.fieldElement(fieldName).element(by.xpath(".//../following-sibling::*"));
    form: EFStrFunc = (action: string) => ele(by.xpath("//text()[contains(.,'" + action + "')]/ancestor::form"));
    dropdownWithText: EFStrFunc = (text: string) => ele(by.xpath("//text()[contains(.,'" + text + "')]/ancestor::md-select"));
    inputWithText: EFStrFunc = (text: string) => this.tagWithText(text, "md-input-container").element(by.css("input"));
    menuWithText: EFStrFunc = (text: string) => this.tagWithText(text, "md-menu");
    buttonWithText: EFStrFunc = (text: string) => this.tagWithText(text, "button");
    linkIdentifier: EFStrFunc = (link:string) => ele(by.linkText(link));
    optionWithText: EFStrFunc = (text: string) => ele.all(by.xpath("//text()[contains(.,'" + text + "')]/ancestor::md-option")).last();
    actionButton: EFStrFunc = (actions: string) => ele(by.buttonText(actions));
    tabIdentifier: EFStrFunc = (tab: string) => ele(by.xpath("//md-tab-item[contains(text(),'"+tab+"')]"));
    tagWithText: (text: string, tag: string) =>
        EF = (text: string, tag: string) =>
        ele(by.xpath("//text()[contains(.,'" + text + "')]/ancestor::"+tag));
    tableBodyRow: EFStrFunc = (link:string) => this.linkIdentifier(link).element(by.xpath("ancestor::tr"));
    linkOption: EFStrFunc = (link:string) => ele(by.linkText(link));
    rowByIndex: EFNumFunc = (index: number) => {
        let element = ele(by.xpath("(//tbody//tr)[" + (index+1) + "]"));
        console.log("here: " + element.locator());
        return element;
    }
    colsByIndex: (row: number, col: number) =>
        EF = (row: number, col: number) =>
        this.rowByIndex(row).element(by.xpath("(.//td)[" + (col+1) + "]"));
    checkboxInRowWithText: EFStrFunc = (text: string) => this.tagWithText(text, "tr").element(by.css("md-checkbox"));
    checkboxWithText: EFStrFunc = (text: string) => this.tagWithText(text, 'md-checkbox');

    elementWithText: (text: string) => EF = (text: string) =>
        ele(by.xpath("//*[contains(text(),'"+text+"')]"));

    elementsWithText: (text: string) => EAF = (text: string) =>
        ele.all(by.xpath("//*[contains(text(),'"+text+"')]"));

    open(): Promise<Page|boolean> {
        throw new Error(Err.PAGE_NOT_SUPPORT_FUNCTION("open"));
    }

    isCurrentPage (): Promise<boolean> {
        throw new Error(Err.PAGE_NOT_SUPPORT_FUNCTION("isCurrentPage"));
    }

    async getTable(column: string): Promise<EF> {
        let tables: EAF = ele.all(by.css("table"));
        for(let i = 0; i < await tables.count(); i++){
            let table: EF = tables.get(i);
            let tableHeader: EF = table.all(by.css("thead")).first();
            let columns: string = await waitText(tableHeader);
            if(columns.indexOf(column) !== -1) {
                return tables.get(i);
            }
        }

        throw Error("getTable(): column header is not found in any tables - " + column);
    }

    /**
     * A function to grab the specific cell data inside a specific column
     * by using the link text in a table row to get the table row locator 
     * and column index to extract that cell data you wish to grab
     * 
     * @param link takes a link inside a table row
     * @param columnIndex index of whatever column you wish to grab the data from
     */
    async getTableCellData(link: string, columnIndex: number) {
        let row = this.tableBodyRow(link);
        let cellData = row.all(by.css("td")).get(columnIndex);
        return await waitText(cellData);
    }

    async getColumnIndex(column: string): Promise<number> {
        let table: EF = await this.getTable(column);
        let tableHeader: EF = table.all(by.css("thead")).first();
        let header: EAF = tableHeader.all(by.css("th"));
        let headerCount: number = await header.count();

        for(let i = 0; i < headerCount; i++) {
            let text = await header.get(i).getText();
            if(text.indexOf(column) !== -1) {
                await logger.debug("getColumnIndex: column: " + column + " index: " + i);
                return i;
            }
        }
        return -1;
    }

    async getColumnData(column: string): Promise<{}> {
        let index: number = await this.getColumnIndex(column);
        let table: EF = await this.getTable(column);
        let rows: EAF = table.all(by.css("tbody tr"));
        let result = {};

        result[column] = [];
        let rowCount: number = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            let row = await rows.get(i);
            let ele = await row.all(by.css("td")).get(index);
            let str = await waitText(ele);
            result[column].push(str);
        }
        return result
    }

    async filterColumn(column: string, searchData: string): Promise<void>{
        let columnIndex: number = Number(await this.getColumnIndex(column)) + 1;
        let table: EF = await this.getTable(column);
        let searchHeaderRow: EF = table.all(by.css("thead tr")).get(1);
        let search: EF = searchHeaderRow.element(by.xpath("(.//input)["+columnIndex+"]"));
        await search.clear();
        await search.sendKeys(searchData);
        await utils.screenshot(column+'-filter.png');
    }

    async verifyFilteredColumn(column: string, value: string): Promise<boolean> {
        let columnData: {} = await this.getColumnData(column);
        let columnDataArr = columnData[column];
        for(let i = 0; i < columnDataArr.length; i++){
            if(columnDataArr[i] !== value){
                logger.debug("Column did not filter correctly: " + columnDataArr[i] + "!==" + value)
                return false;
            }
        }
        return true;
    }

    async filter(table: EF, columnIndex: number, suppliedValue?: string): Promise<{}[]> {
        return Filter.column(table, columnIndex, suppliedValue);
    }

    async clearFilters(): Promise<void> {
        let filterCount = await this.columnFilters.count();
        for (let i = 0; i < filterCount; i++) {
            await browser.actions().mouseMove(this.columnFilters.get(i)).perform();
            await waitVisible(this.columnFilters.get(i));
            await this.columnFilters.get(i).clear();
        }
    }

    async sort(table: EF, columnIndex: number): Promise<string[]> {
        let sortButton: EF = table.all(by.css("md-icon.md-sort-icon")).get(columnIndex)
        await browser.actions().mouseMove(sortButton).perform();
        await waitClick(sortButton);
        let bodyRows: EAF = table.all(by.css("tbody tr"));
        let rowCount: number = await bodyRows.count();
        let columnResult = [];
        for(let i = 0; i < rowCount; i++) {
            columnResult.push(await bodyRows.get(i).all(by.css("td")).get(columnIndex).getText());
        }
        return columnResult;
    }

    //sorts a specific column DESC order
    async sortColumn(column: string): Promise<{}> {
        let table = await this.getTable(column);
        let index = await this.getColumnIndex(column);
        let result: {};

        await waitClick(table.all(by.css("md-icon.md-sort-icon")).get(index));
        result = await this.getColumnData(column);
        await waitClick(table.all(by.css("md-icon.md-sort-icon")).get(index));
        return result;
     }

     //verifys that a column is sorted in DESC order
     async verifySortedColumn(columnData: string, column: string): Promise<boolean> {
        let strDataArr: string[] = columnData[column];
        if(utils.isNumberArray(strDataArr)){
          let numDataArr: number[] = strToNumArray(strDataArr);
          return utils.verifySortedArray(numDataArr);
        }else{
          return utils.verifySortedArray(strDataArr);
        }
     }
    /**
     * verifyDropDownOptions()
     * 
     * @param dropDown - drop down element locator
     * @param table - takes in a column with a header of 'options' 
     * 
     * generalized function that verifys the options in a specific drop down
     * uses a table with a 'options' column that verifys every option in that
     * table
     * 
     */
    async verifyDropDownOptions(dropDown: EF, table: TableDefinition):Promise<boolean> {
        await waitClick(dropDown, 1500, ele.all(by.css("md-option")).last());
        let result = true;

        for(let entry of table.hashes()){
            if(!await this.optionWithText(entry.options)){
                result = false;
                logger.error(entry.options + " was not found in dropdown: " + dropDown.locator());
                break;
            }
        } 
        await waitClick(this.body);

        return result;
    }

    getRowByTableData(tableData: EF): EF {
        return tableData.element(by.xpath("ancestor::tr"));
    }

    async enterInputField( inputField: EF, input: string){
        await waitVisible(inputField);
        await inputField.clear();
        await inputField.sendKeys(input);
    }

    async selectDropoDownValue( dropDown: EF, value: string){
        if(value == ''){
            logger.warn(dropDown.locator + ': value is an empty string');
            return;
        }
        
        await waitClick(dropDown, 2000, this.optionWithText(value));
        await waitClick(this.optionWithText(value));
    }

    async verifyRequiredFieldErrMsg(ele: EF): Promise<boolean> {
        let verify = await ele.element(by.xpath('ancestor::md-input-container')).getAttribute('class');
        return verify.indexOf('md-input-invalid') !== -1;
    }

}
