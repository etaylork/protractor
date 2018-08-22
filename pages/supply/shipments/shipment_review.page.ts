import { by, element, EF, EAF, waitClick, waitText } from '../../../utils';
import { ShipmentPage } from './shipment.page';

export class ShipmentReviewPage extends ShipmentPage {

    receiveShipmentButton: EF = element(by.buttonText('Receive Shipment'));
    backButton: EF = element.all(by.xpath('//button[contains (., BACK)]')).first();

    private discreteKits: EAF = element.all(by.xpath('//section[@wz-title="WIZ.REVIEW"]//form[@name="ctrl.discreteInventoryForm"]//tbody//tr'));
    private bulkKits: EAF = element.all(by.xpath('//section[@wz-title="WIZ.REVIEW"]//form[@name="ctrl.bulkInspectForm"]//tbody//tr'));

    private discreteCheckboxes = {
        'Available': by.xpath('./td[2]/md-checkbox[contains(@class, "md-checked")]'),
        'Damaged': by.xpath('./td[3]/md-checkbox[contains(@class, "md-checked")]'),
        'Lost': by.xpath('./td[4]/md-checkbox[contains(@class, "md-checked")]')
    };

    private bulkInputs = {
        'Available': by.xpath('./td[3]'),
        'Damaged': by.xpath('./td[4]'),
        'Lost': by.xpath('./td[5]')
    };

    private shipmentConfirmationText = element.all(by.repeater('message in response.successes track by $index')).first();

    async availableKitCount() {
        return this.getKitStatusCount("Available");
    }

    async damagedKitCount() {
        return this.getKitStatusCount("Damaged");
    }

    async lostKitCount() {
        return this.getKitStatusCount("Lost");
    }

    async getKitStatusCount(status: string): Promise<Number> {
        let count = 0;
        let dp = await this.discreteKits.map(async (d)=>{
            let isPresent = await d.element(this.discreteCheckboxes[status]).isPresent();
            if (isPresent){
                count++;
            }
        });
        let bp = await this.bulkKits.map( async (b)=>{
            let val = await waitText(b.element(this.bulkInputs[status]));
            let i = parseInt(val);
            if (i){
                count += i;
            }
        });
        return Promise.all([...dp,...bp]).then(() => count);
    }

    getShipmentConfirmationText() {
        return waitText(this.shipmentConfirmationText);
    }

    async clickBackButton() {
        await waitClick(this.backButton);
    }
}