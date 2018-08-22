import { by, element, EF, EFStrFunc, Page, sidebar } from '../../../utils';

export class OrderSupplyPage extends Page {

   cellData: EFStrFunc = (kit: string) => element(by.xpath("(//td[1])[contains(text(),'"+kit+"')]"));
   orderSupplyButton: EF = element(by.css('button[ng-click="ctrl.goToSiteOrder()"]'));

    async open(): Promise<Page> {
        await sidebar.openOrderSupplyPage();
        return new OrderSupplyPage();
    }

    async enterKitQuantity(kit: string, quantity: string){
        let kitRow: EF = this.cellData(kit).element(by.xpath('ancestor::tr'));
        await kitRow.element(by.css('input[placeholder="Quantity"]')).clear();
        await kitRow.element(by.css('input[placeholder="Quantity"]')).sendKeys(quantity);
    }
}