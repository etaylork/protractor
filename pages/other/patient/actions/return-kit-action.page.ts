import { by, element, EF, EAF, Page, waitText } from '../../../../utils';
import { PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';
import { KitReturnBeginPage } from '../steps/kit-return-begin.page';
import { Process } from '../../process';
export class ReturnKitAction extends Page implements Process {
    data: PatientKitData;

    missingCheckbox = element(by.model('dispensing.marked'));
    addCommentField = element(by.css('input[placeholder="Add a comment"]'));
    tableBodyRows = element.all(by.css('tr[ng-repeat="dispensing in dispensings"]'));
    defineQuantitiesNextButton = element(by.css('section[wz-title="WIZ.RETURN_QUANTITIES"]')).element(by.buttonText('Next'));

    constructor(data?: PatientKitData) {
        super();
        this.data = data;
    }

    async run(): Promise<void> {

        let steps: PatientKitStep = new KitReturnBeginPage();

        do {
            steps = await steps.visit(this.data);
        } while (steps != null);
    }
    async getMissingQuantityAmount(): Promise<string> {
        return await waitText(this.tableBodyRows.first().all(by.css('td')).get(4))
    }

    async getKitID(status: string): Promise<string> {
        let row: EF = element(by.xpath("//*[contains(text(),'" + status + "')]//ancestor::tr"));
        return await waitText(row.all(by.css("td")).get(3));
    }

    async validateInputFields(): Promise<boolean> {
        let tableRow: EF = this.tableBodyRows.first();
        let rowData: EAF = tableRow.all(by.css('td'));
        return await rowData.get(5).element(by.css('input')).isDisplayed() &&
            await rowData.get(6).element(by.css('input')).isDisplayed() &&
            await rowData.get(7).element(by.css('input')).isDisplayed();
    }

    async validateEmpyInputFields(): Promise<boolean> {
        let tableRow: EF = this.tableBodyRows.first();
        let rowData: EAF = tableRow.all(by.css('td'));
        return (await rowData.get(5).element(by.css('input')).getAttribute('class')).indexOf('ng-empty') !== -1 &&
            (await rowData.get(6).element(by.css('input')).getAttribute('class')).indexOf('ng-empty') !== -1 &&
            (await rowData.get(7).element(by.css('input')).getAttribute('class')).indexOf('ng-empty') !== -1
    }

    async enterDetail(detail: string, value: string): Promise<void> {
        let details: string[] = ["Used", "Returned", "Missing"];
        let inputFields: EAF = this.tableBodyRows.first().all(by.css('input[placeholder="Quantity"]'));

        for (let i = 0; i < details.length; i++) {
            if (details[i] === detail) {
                await inputFields.get(i).clear();
                await inputFields.get(i).sendKeys(value);
            }
        }
    }

}