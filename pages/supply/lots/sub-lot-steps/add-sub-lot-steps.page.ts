import { by, ele, EF, EFNumFunc, waitClick } from '../../../../utils';
import { Page } from "../../..";
import { AddSubLotData } from '../';
import { SubLotStep } from '../../../';
import { SubLotReviewPage } from '.';

export class AddSubLotPage extends Page implements SubLotStep {

    nextButton: EF = ele.all(by.buttonText('NEXT')).last();
    addKitButton: EF = ele(by.buttonText('add'));
    kitTypeField: EFNumFunc = (index: number) => (ele.all(by.model("content.im")).get(index)).element(by.tagName("md-select"));
    kitQuantityField: EFNumFunc = (index: number) => (ele.all(by.model("content.quantity")).get(index)).element(by.tagName("input"));
    getOption = (text: string) => ele.all(by.cssContainingText("md-option *", text));

    async visit(data: AddSubLotData): Promise<SubLotStep> {
        await this.addSupply(data['supply'], data['quantity']);
        await waitClick(this.nextButton);
        return new SubLotReviewPage()
    }

    async addSupply(supply: string, quantity: string): Promise<void> {
        let kits = supply.split(',');
        let count: number = kits.length;
        let j = 0;
        for (let i = 0; i < count - 1; i++) await waitClick(this.addKitButton);
        for (let i = 0; i < kits.length; i++) {
            await waitClick(this.kitTypeField(j));
            await waitClick(this.getOption(kits[i]).get(1));
            await waitClick(this.kitQuantityField(j));
            await this.kitQuantityField(j).sendKeys(quantity);
            j++;
        }
    }
}