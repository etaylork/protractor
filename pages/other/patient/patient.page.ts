import { EFStrFunc, EF, EAF, waitClick, waitText, Page, sidebar, TableDefinition } from '../../../utils';
import { by, element, browser } from 'protractor';
import { ReturnKitAction, ReplaceKitAction } from './actions';
import { EventPage } from './event.page';

export class PatientPage extends EventPage {

    //page elements
    body: EF = element(by.css("body"));
    screenAPatientButton: EF = element(by.id('screen_patient_btn'));
    randomizeAPatientButton: EF = element.all(by.xpath("//text()[contains(.,'Randomize')]/ancestor::*[self::a][1]")).first();
    customTitle: EF = element(by.css('p.md-title'));
    patientRows: EAF = element.all(by.xpath("//div[@e2e-id='patients']//tbody//tr"));

    actionButton: EFStrFunc = (action: string) => element(by.css(".md-clickable")).element(by.buttonText(action));
    visitLink: EFStrFunc = (action: string) => element.all(by.linkText(action)).first();

    //Low-level functions

    async open(): Promise<Page> {
        await sidebar.openPatientPage();
        return new PatientPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("/patients") !== -1;
    }

    async clickRandomizeAPatient(): Promise<void> {
        await waitClick(this.randomizeAPatientButton);
    }

    async getPatientRowCount() {
        return await this.patientRows.count();
    }

    async clickScreenAPatient() {
        await waitClick(this.screenAPatientButton);
    }

    async getKitValue(patientRow: EF): Promise<string> {
       let kitColumn = patientRow.all(by.css("td")).get(6);
       return await waitText(kitColumn);
    }

    async verifyPatientAction(patientRow: EF, action: string): Promise<boolean> {
        let actionDropDown = patientRow.element(by.css('.icon-text'));
        await waitClick(actionDropDown, 15000, this.actionButton(action));
        return await this.actionButton(action).isDisplayed();
    }

    async selectPatientAction(action: string, patientRow: EF = this.tableBodyRows.get(0)): Promise<void> {
        let actionDropDown = patientRow.element(by.css(".icon-text"));
        await waitClick(actionDropDown, 15000, this.actionButton(action));
        return await waitClick(this.actionButton(action));
     }

    async returnKitAction(patientRow: EF, table: TableDefinition): Promise<void> {
        let tableData = (table.rows())[0];
        let data = {
            reason: tableData[0],
            quantity: tableData[1],
        }

        let actionDropDown: EF = patientRow.element(by.css(".md-menu.ng-scope._md"));
        await waitClick(actionDropDown, 15000, this.actionButton("Return kit"));
        await waitClick(this.actionButton("Return kit"));
        return await new ReturnKitAction(data).run();
    }

    async replaceKitAction(patientRow: EF, table: TableDefinition): Promise<void> {
        let tableData: string[] = (table.rows())[0];
        let data = {
            reason: tableData[0],
            quantity: tableData[1],
        }

        let actionDropDown: EF = patientRow.element(by.css(".md-menu.ng-scope._md"));
        await waitClick(actionDropDown, 15000, this.actionButton("Replace Kit"));
        await waitClick(this.actionButton("Replace Kit"));
        return await new ReplaceKitAction(data).run();
    }

    async clickPatientActionLink(patient: string, action: string): Promise<void> {
        let randomizeButton = this.tableBodyRow(patient).element(by.linkText(action));
        await waitClick(randomizeButton);
    }

}
