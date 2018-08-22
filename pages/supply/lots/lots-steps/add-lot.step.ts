import { browser, by, EF, EFNumFunc, ele, Key, logger, waitClick, waitVisible, utils } from '../../../../utils';
import { Step } from '../../../';
import { AddLotData } from '../processes/add-lot.process';
import { AddLotReview } from '../lots-steps';

export class AddLot implements Step {

    section: EF = ele(by.css("[wz-title='ADD_LOT']"));
    addLotButton: EF = ele(by.buttonText("Add a lot"));
    addKitButton: EF = ele(by.buttonText("add"));
    expirationDateButton: EF = ele(by.css("md-datepicker button"));
    focusedDate: EF = ele(by.css(".md-calendar-date.md-focus"));
    shippingContainerField: EF = ele(by.model("model.shipping_container"));
    kitTypeField: EFNumFunc = (index: number) => (ele.all(by.model("content.im")).get(index)).element(by.tagName("md-select"));
    kitQuantityField: EFNumFunc = (index: number) => (ele.all(by.model("content.quantity")).get(index)).element(by.tagName("input"));
    locationField: EF = ele(by.model("model.lot_depot"));
    lotDescriptionField: EF = ele(by.model("model.lot_desc")).element(by.tagName("input"));
    lotNumberField: EF = ele(by.model("model.lot_id")).element(by.tagName("input"));
    nextButton:EF = this.section.element(by.buttonText("Next"));

    getOption = (text: string) => ele.all(by.cssContainingText("md-option *", text));

    async visit (lot: AddLotData): Promise<Step> {
        await logger.debug("AddLot.visit(): " + JSON.stringify(lot));

        await waitClick(this.addLotButton);

        if((await utils.status(this.shippingContainerField)).displayed){
            await waitClick(this.shippingContainerField);
            await waitClick(this.getOption(lot.container).first());
        }

        await waitClick(this.lotNumberField);
        await this.lotNumberField.sendKeys(lot.number);
        await waitClick(this.lotDescriptionField);
        await this.lotDescriptionField.sendKeys(lot.description);
        await waitClick(this.locationField);
        await waitClick(this.getOption(lot.location).first());
        await waitClick(this.expirationDateButton);
        await waitVisible(this.focusedDate);
        await browser.actions().sendKeys(Key.ARROW_RIGHT).perform();
        await browser.actions().sendKeys(Key.ARROW_RIGHT).perform();
        await waitClick(this.focusedDate);
        if(lot.kitType.indexOf(",") !== -1){
            await this.getOptions(lot.kitType, lot.quantity);
        }else{
            await waitClick(this.kitTypeField(0));
            await waitClick(this.getOption(lot.kitType).first());
            await waitClick(this.kitQuantityField(0));
            await this.kitQuantityField(0).sendKeys(lot.quantity);
        }
        await utils.screenshot('add-new-lot-page.png');
        await waitClick(this.nextButton);
        return new AddLotReview();
    }

    async getOptions(kitTypes: string, quantity: number): Promise<void> {
        let lotArr: string[] = kitTypes.split(",");
        
        // adds how many kits to add to the lot
        for(let i = 1; i < lotArr.length; i++) await waitClick(this.addKitButton);

        //uploads the kit data
        for(let i = 0; i < lotArr.length; i++){
            await waitClick(this.kitTypeField(i));
            await waitClick(this.getOption(lotArr[i]).get(1));
            await waitClick(this.kitQuantityField(i));
            await this.kitQuantityField(i).sendKeys(quantity);
        }
    }
}