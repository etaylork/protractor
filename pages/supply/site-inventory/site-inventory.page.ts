import { browser, by, element, EF, EAF, EFStrFunc, Page, sidebar, waitText, waitClick, v } from '../../../utils';
import { EventPage } from '../../other';
export class SiteInventoryPage extends EventPage {

    reviewPageNextButton: EF = element.all(by.buttonText('Next')).get(1);
    bulkStatusHeaders: EAF = element.all(by.repeater('status in ctrl.statuses'));
    inventoryForm: EF = element(by.css('form[name="ctrl.inventoryForm"'));

    cellData: EFStrFunc = (id: string) => element(by.xpath('.//td[contains(text(),"'+id+'")]'));
    discreteTableHeaderCheckbox: EFStrFunc = (status: string) => element(by.xpath("//th//md-checkbox//div[contains(text(),'"+status+"')]"));

    async open(): Promise<Page> {
        await sidebar.openSiteInventoryPage();
        return new SiteInventoryPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, "supply/site-inventory");
    }

    async markDiscreteKits( kitID: string, status: string): Promise<void> {
        let discreteKitRow: EF = this.cellData(kitID).element(by.xpath('ancestor::tr'));
        await waitClick(discreteKitRow.element(by.css('md-checkbox[aria-label="Mark '+ status +'"]')));
    }

    async markBulkKits(kitType: string, status: string, quantity: string): Promise<void> {
        let bulkKitRow: EF = this.cellData(kitType).element(by.xpath('ancestor::tr'));
        let index: number = await this.getBulkStatusColumnIndex(status);
        await bulkKitRow.all(by.css('input[placeholder="Quantity"]')).get(index).sendKeys(quantity);
    }

    private async getBulkStatusColumnIndex(status: string): Promise<number> {
        let count = await this.bulkStatusHeaders.count();
        for(let i = 0; i < count; i++){
            let text: string = await waitText(this.bulkStatusHeaders.get(i));
            if(text.indexOf(status) !== -1) return i;
        }

        return -1;
    }

    async verifyMarkedDiscreteKit(kitID: string, status: string): Promise<string>{
        let discreteKitRow: EF = this.cellData(kitID).element(by.xpath('ancestor::tr'));
        return await discreteKitRow.element(by.css('md-checkbox[aria-label="Mark '+ status +'"]')).getAttribute('aria-checked');
    }

    async markAllDiscreteKits(status: string): Promise<void> {
        await waitClick(this.discreteTableHeaderCheckbox(status));
        await waitClick(element(by.partialLinkText("10 kits selected as '"+status+"'")));
    }

    async changeBulkKitStatuses(oldStatus: string, newStatus: string, kitType: string): Promise<void> {
        let index1 = await this.getBulkStatusColumnIndex(oldStatus);
        let index2 = await this.getBulkStatusColumnIndex(newStatus);
        let discreteRows = element.all(by.xpath('(.//td[1])[contains(text(),"'+kitType+'")]/ancestor::tr'));
        let count = await discreteRows.count();

        for(let i = 0; i < count; i++ ){
            let checkStatus = await discreteRows.get(i).all(by.repeater("status in ctrl.statuses")).get(index1);

            if((await checkStatus.element(by.css("md-input-container")).getAttribute('class')).indexOf('md-input-has-value') !== -1){
                let updateStatus = await discreteRows.get(i).all(by.css('input[placeholder="Quantity"]')).get(index2);
                let quantity = await checkStatus.element(by.css('input')).getAttribute('ng-max');
                await updateStatus.sendKeys(quantity);
            }
        }

    }

    async verifyInventoryDisplayed(): Promise<boolean> {
        let hasDiscreteSupply: EF = this.inventoryForm.element(by.css('span[ng-show="ctrl.hasDiscretes"]'));
        let hasBulkSupply: EF = this.inventoryForm.element(by.css('span[ng-show="ctrl.hasBulks"]'));
        return( (await hasDiscreteSupply.getAttribute('aria-hidden')).indexOf('false') !== -1  || (await hasBulkSupply.getAttribute('aria-hidden')).indexOf('false') !== -1 );
    }

}