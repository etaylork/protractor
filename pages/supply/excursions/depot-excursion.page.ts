import { by, browser, EF, EAF, element, sidebar, Page, waitClick, EFStrFunc, waitText, EFNumFunc } from '../../../utils';

export class DepotExcursionPage extends Page {

    //element locators
    kitId: EFStrFunc = (kit: string): EF =>  element(by.xpath('//tr//td[1][contains(text(),"'+kit+'")]'));
    statusSelectionSection: EF = element(by.css("[wz-title='WIZ.DEPOT_INVENTORY_STATUS_SELECTION']"));
    statusSelectionNextButton: EF = this.statusSelectionSection.element(by.buttonText("Next"));
    enterDetailsSection: EF = element(by.css("[wz-title='WIZ.ENTER_DETAILS']"));
    enterDetailsNextButton: EF = this.enterDetailsSection.element(by.buttonText("Next"));
    reviewSection: EF = element(by.css("[wz-title='WIZ.REVIEW']"));
    reviewNextButton: EF = this.reviewSection.element(by.buttonText("Next"));
    depotDropDown: EF = element(by.model('ctrl.depot'));
    startDateField: EF = element.all(by.css('[placeholder="Enter Date"]')).first();
    endDateField: EF = element.all(by.css('[placeholder="Enter Date"]')).last();
    hoursField: EF = element.all(by.model('h')).first();
    minutesField: EF = element.all(by.model('m')).first();
    tempExcursionCheckBox: EF = element(by.css('[aria-label="Mark all Temp excursion"]'))
        .element(by.xpath('.//div[@class="md-container"]'));

    nextButtons: EAF = element.all(by.css('button.btn-4g.btn-next.md-button.md-ink-ripple'));
    dateFields: EAF = element.all(by.css('input[aria-label="Enter Date"]'));
    hourFields: EAF = element.all(by.model('h'));
    minuteFields: EAF = element.all(by.model('m'));
    meridiemFields: EAF = element.all(by.model('a'));

    dropdownValue: EFStrFunc = (value: string) => element(by.xpath('//md-option[@value="'+value+'"]'));
    depotExcursionSteps = async () => await element.all(by.repeater('step in getEnabledSteps()')).count();

    //low-level functions
    async open(): Promise<Page> {
        await sidebar.openDepotExcursionPage();
        return new DepotExcursionPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("/study/depot-excursion") !== -1;
    }

    async enterStartDateAndTime(date:string, hours:string, mins: string): Promise<void> {
        await this.startDateField.clear();
        await this.startDateField.sendKeys(date);
        await this.hoursField.clear();
        await this.hoursField.sendKeys(hours);
        await this.minutesField.clear();
        await this.minutesField.sendKeys(mins);
    }

    async enterEndDate(date:string): Promise<void> {
        await this.endDateField.clear();
        await this.endDateField.sendKeys(date);
    }

    async selectDepot(depot: string): Promise<void> {
        await waitClick(this.depotDropDown, 15000, this.dropdownValue(depot));
        await waitClick(this.dropdownValue(depot));
    }

    async markDiscreteSupply( countOfKits: number, status: string): Promise<void> {
        let checkBoxs = element.all(by.css('md-checkbox[aria-label="'+this.checkBoxLabels(status)+'"]'));
        for(let i = 0; i < countOfKits; i++){
            await waitClick(checkBoxs.get(i));
        }
    }

    private checkBoxLabels(status: string): string {
          switch(status){
            case 'Temp excursion' : return 'Mark Temp Excursion'
            case 'Intact': return 'Mark Intact'
            case 'Quarantined': return 'Mark Quarantined'
            default : return null;
        }
    }

    async markBulkSupply(kit: string, status: string, quantity: string): Promise<void> {
        let row = this.kitId(kit).element(by.xpath('ancestor::tr'));
        let statuses = [ 'intact', 'Temp excursion', 'Quarantined'];
        let inputField = row.all(by.css('input[placeholder="Quantity"]')).get(statuses.indexOf(status));
        await waitText(inputField);
        await inputField.clear();
        await inputField.sendKeys(quantity);
    }

    async enterTempDetail(detail: string, value: string): Promise<void> {
        let row = element(by.xpath('//td[contains(text(),"'+detail+'")]//ancestor::tr'));
        let inputField = row.element(by.css('input'));
        await inputField.clear();
        await inputField.sendKeys(value);
    }

    async enterDateExcursionStarted(dateAndTime: string){
        let arr = this.parseDateAndTime(dateAndTime);

        await this.dateFields.get(0).clear();
        await this.dateFields.get(0).sendKeys(arr[0]);
        await this.hourFields.get(0).clear();
        await this.hourFields.get(0).sendKeys(arr[1]);
        await this.minuteFields.get(0).clear();
        await this.minuteFields.get(0).sendKeys(arr[2])

        let ele = element.all(by.css('md-option[value="'+arr[3]+'"]')).last();
        await waitClick(this.meridiemFields.get(0), 1500, ele);
        await waitClick(ele);

    }

    async enterDateExcursionEnded(dateAndTime: string){
        let arr = this.parseDateAndTime(dateAndTime);

        await this.dateFields.get(1).clear();
        await this.dateFields.get(1).sendKeys(arr[0]);
        await this.hourFields.get(1).clear();
        await this.hourFields.get(1).sendKeys(arr[1]);
        await this.minuteFields.get(1).clear();
        await this.minuteFields.get(1).sendKeys(arr[2])

        let ele = element.all(by.css('md-option[value="'+arr[3]+'"]')).last();
        await waitClick(this.meridiemFields.get(1), 15000, ele);
        await waitClick(ele);

    }

    private parseDateAndTime(dateAndTime:string): string [] {
        dateAndTime = dateAndTime.replace(":", " ");
        return dateAndTime.split(" ");
    }
}