import { by, element, EF, EAF, EFStrFunc, Page, sidebar, waitClick, waitText, waitVisible} from '../../../utils';

export class ExcursionPage extends Page {

    /* element locators */ 
    kitId: EFStrFunc = (kit: string) =>  element(by.xpath('//tr//td[1][contains(text(),"'+kit+'")]'));
    tempExcursionId: EFStrFunc = (excursion: string) =>  element(by.xpath('//tr//td[1][contains(text(),"'+excursion+'")]'));
    selectAllRadioButton: EFStrFunc = (status: string) => element(by.css('th md-radio-button[value="'+status+'"]'));
    
    donePageTempDetails: EF = element.all(by.css('md-table-container[excursions="[ctrl.excursion]"] tbody tr')).last();
    showAllCheckBox: EF = element(by.model('showAll'));

    async open(): Promise<Page> {
        await sidebar.openExcursionPage();
        return new ExcursionPage();
    }

    async selectProgressLink(excurisonId: number): Promise<void> {
        let row: EF = this.tempExcursionId(String(excurisonId)).element(by.xpath('ancestor::tr'));
        await waitVisible(row, 2000);
        await waitClick(row.element(by.css('a[ng-click="action({excursion: excursion})"]')));
    };

    async markAllBulkSupply(status: string): Promise<void> {
        let rows: EAF = element.all(by.repeater('kit in ctrl.excursion.bulk_kits'));
        let quantity: string = await rows.get(0).element(by.xpath('//input[@placeholder="Quantity"][1]')).getAttribute('ng-max');
        let statuses: string[] = [ 'Resolved', 'Rejected'];

        for(let i = 0; i < await rows.count(); i++){
            let row = rows.get(i);
            let inputField = row.all(by.css('input[placeholder="Quantity"]')).get(statuses.indexOf(status));
            await inputField.clear();
            await inputField.sendKeys(quantity);
        }
    }

    async getTempDetails(excursion: string): Promise<string[]> {
        let row: EF = await this.getRowByTableData(this.tempExcursionId(String(excursion)));
        let details: EAF = row.all(by.css('td'));
        let temperatureDetails: string[] = [];

        for(let i = 0; i < await details.count() - 1 ; i++ ){
            let data = await waitText(details.get(i));
            temperatureDetails.push(data);
        }

        temperatureDetails.splice(1,1);

        return temperatureDetails;
    }

    async partiallyMarkDiscreteKits(status: string){
        let discreteRows: EAF = element.all(by.css('tbody tr md-radio-button[value="'+status+'"]'));
        let count: number = await discreteRows.count();

        for(let i = 0; i < Math.floor(count/2); i++){
            await waitClick(discreteRows.get(i));
        }
    }

    async partiallyMarkBulkKits(status: string){
        let bulkRows: EAF = element.all(by.model('kit.'+status));
        let count: number = await bulkRows.count();
        if (count <= 1) return;

        for(let i = 0; i < Math.floor(count/2); i++){
            let x =  await bulkRows.get(i).element(by.css('input')).getAttribute('ng-max');
            let quantity = Number(x);
            let inputField = bulkRows.get(i).element(by.css('input'));
            await inputField.clear();
            await inputField.sendKeys(quantity);
        }
    }
}