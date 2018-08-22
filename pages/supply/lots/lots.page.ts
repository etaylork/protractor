import { browser, by, ele, EAF, EF, logger, Page, run, sidebar, waitClick, utils } from '../../../utils';
import { ITable, TableValidation, waitText } from '../../';
import { AddLotData, AddLotProcess, AddSubLotData, AddSubLotProcess } from './';
import { SelectorPage } from '../../../pages/other/selector/selector.page';

const data = require('./lots.data.json');

const selectorPage: SelectorPage = new SelectorPage();

/**
 * Page - requires open() and isCurrentPage() functions
 * ITable - signals page has a table and requires containsData() function
 */
export class LotsPage extends Page implements ITable {

    //new page elements
    addLotButton: EF = ele(by.buttonText("Add a lot"));
    addKitButton: EF = ele(by.buttonText("add"));
    backToLotsButton: EF = ele(by.buttonText('Back To Lots'));
    emailField: EF = ele(by.model("email"));
    filterRow: EF = ele(by.xpath("//thead//tr[2]"));
    header: EF = ele(by.xpath("//thead//tr[1]"));
    locationField: EF = ele(by.model("model.lot_depot"));
    depotOptions: EAF = ele.all(by.repeater("depot in depots"));
    passwordField: EF = ele(by.model("password"));
    quarantineButton: EF = ele(by.buttonText('Quarantine'));
    releaseButton: EF = ele(by.buttonText('Release'));
    releaseQuarantineButton: EF = ele(by.buttonText('Release From Quarantine'));
    updateExpirationDateButton: EF = ele(by.buttonText("Update Expiration Date"));
    updateExpirationDateButton2: EF = ele(by.buttonText("UPDATE EXPIRATION DATE"));
    updateExpirationDateField: EF = ele(by.css('[placeholder="Enter Date"]'));

    actionsColumn: EF = ele.all(by.repeater("col in column_details")).last();

    menuitems:EAF = ele.all(by.css('[role="menuitem"]'));
    rows:EAF = ele.all(by.xpath("//tbody/tr"));

    kitQuantities = async (row: EF) => await row.all(by.repeater('col in column_details')).get(4)
        .all(by.repeater('content in data track by $index')).map(async k => Number(await k.getText()));
    lotNumber = (lotNumber: string) => ele(by.linkText(lotNumber)).ele(by.xpath("ancestor::tr"));

    async createLot(lot: AddLotData): Promise<void> {
        let recover = async () => {
            await browser.refresh();
            await selectorPage.selectStudyByName(browser.params.study);
            await selectorPage.submit();
            await this.open();
        }
        await run(new AddLotProcess(lot), recover);
    }

    async open(): Promise<Page> {
        await sidebar.openLotsPage();
        return new LotsPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("supply/lots") !== -1;
    }

    /**
     * Satisfies the ITable implementation and tests for data in the pages table
     * @param data table data in the format { "header-1": [ "entry-1" ] }
     */
    async containsData(dataId: string): Promise<boolean> {
        return await TableValidation.validateTable(this.table, data[dataId]);
    }

    async filterKits(kit: string, columnindex: number = 3): Promise<void> {
        let kitColumn =  this.filterRow.all(by.model('ctrl.inputFilters[path]')).get(columnindex);
        await kitColumn.clear(); 
        await kitColumn.sendKeys(kit);
    }

    async clickActionsDropDown(rowIndex: number = 0): Promise<void> {
        let actionsColumn = this.rows.get(rowIndex).all(by.repeater("col in column_details")).get(7);
        await waitClick(actionsColumn);
    }

    async selectAction(action: string, rowindex?: number): Promise<void> {
        await this.clickActionsDropDown(rowindex);

        switch (action) {
            case "quarantine":
                try {
                    await waitClick(this.quarantineButton);
                } catch (e) {
                    logger.warn('failed to click action reclicking....');
                    await browser.refresh();
                    await selectorPage.selectStudyByName(browser.params.study);
                    await selectorPage.selectSiteByName(browser.params.site);
                    await selectorPage.submit();
                    await this.filterKits('Chocolate');
                    await this.selectAction('quarantine');
                }
                return;
            case "update expiration date":
                try {
                    await waitClick(this.updateExpirationDateButton);
                } catch (e) {
                    logger.warn('failed to click action reclicking....');
                    await browser.refresh();
                    await selectorPage.selectStudyByName(browser.params.study);
                    await selectorPage.selectSiteByName(browser.params.site);
                    await selectorPage.submit();
                    await this.filterKits('Chocolate');
                    await this.selectAction('update expiration date');
                }
                return;
            case "release from quarantine":
                try {
                    await waitClick(this.releaseQuarantineButton);
                } catch (e) {
                    logger.warn('failed to click action reclicking....');
                    await browser.refresh();
                    await selectorPage.selectStudyByName(browser.params.study);
                    await selectorPage.selectSiteByName(browser.params.site);
                    await selectorPage.submit();
                    await this.filterKits('Chocolate');
                    await this.selectAction('release from quarantine');
                }
                return;
        }
    }

    async authenticateAction(email: string, password: string): Promise<boolean> {
        let verify = false;

        await this.emailField.clear();
        await this.emailField.sendKeys(email);
        await this.passwordField.clear();
        await this.passwordField.sendKeys(password).then(() => {
            verify = true;
        });

        return verify;
    }

    async updateExpirationDate(date: string): Promise<boolean> {
        let verify = false
        await this.updateExpirationDateField.clear();
        await this.updateExpirationDateField.sendKeys(date).then(() => {
            verify = true;
        });
        return verify
    }

    async getLocationOptions(){
        await waitClick(this.locationField);
        let options: string[] = [];
        for( let i = 0; i < await this.depotOptions.count();i++){
            let text = await waitText(this.depotOptions.get(i));
            options.push(text);
        }
        await utils.screenshot('options-in-location-drop-down.png');
        await waitClick(this.body);
        return options;
    }

    async selectLotAction(action, link){
        let lotRow = await this.tableBodyRow(link);
        await waitClick(lotRow.element(by.xpath(".//*[contains(text(),'Actions')]")));
        await waitClick(ele.all(by.buttonText(action)).last());
    }

    async createSubLot(lot: AddSubLotData, link): Promise<void> {
        let recover = async () => {
            await browser.refresh();
            await selectorPage.selectStudyByName(browser.params.study);
            await selectorPage.submit();
            await this.open();
        }

        await run(new AddSubLotProcess(lot), recover);
    }
}
