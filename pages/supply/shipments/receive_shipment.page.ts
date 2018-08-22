import { by, EF, EAF, EFNumFunc, element, waitClick } from '../../../utils';
import { ShipmentPage } from './shipment.page';

export class ReceiveShipmentPage extends ShipmentPage {

     private allIntactButton: EF = element(by.xpath('//th[@ng-repeat="status in ctrl.statuses" and contains (., "Intact")]/md-checkbox'));
     private allDamagedButton: EF = element(by.xpath('//th[@ng-repeat="status in ctlr.statuses" and contains (., "Intact")]/md-checkbox'));
     private allLostButton: EF = element(by.xpath('//th[@ng-repeat="status in ctrl.statuses" and contains (., "Intact")]/md-checkbox'));

     allBulkRows: EAF = element.all(by.repeater("row in ctrl.inventory | orderBy"));
     allBulkQuantityFields: EAF = element.all(by.model('row[status]'));
     nextButton: EF = element.all(by.buttonText('Next')).first();
     finishButton: EF = element(by.buttonText('Back to Shipments'));
     reviewPageKitRows: EAF = element.all(by.css("form.ng-pristine[name='ctrl.discreteInventoryForm'] tr.md-row.ng-scope"));
     temperatureMonitorField: EF = element(by.model('model.container_id'));
     tempPageNextButton: EF = element.all(by.buttonText('Next')).get(1);


    rowByNumber: EFNumFunc = (rowNumber: number): EF => {
        return this.allRows.get(rowNumber);
    }

    private rowByKitId = (kitId: string) => {
        return element(by.xpath(`//tr[@ng-repeat="row in filteredInventory = (inventory | filter: filters)" and contains(., "${kitId}")]`))
    }

    async markAllIntact() {
        await waitClick(this.allIntactButton);
    }

    async markAllDamaged() {
        await waitClick(this.allDamagedButton);
    }

    async markAllLost() {
        await waitClick(this.allLostButton);
    }

    getRowCount() {
        return this.allRows.count();
    }

    getKitStatusByKitId(kitId: string): Promise<string> {
        let s = this;
        var kitStatus;

        return new Promise((resolve, reject) => {
            s.isChecked(s.rowByKitId(kitId).element(s.intactCheckboxLocator)).then(function(isChecked) {
                if (isChecked) {
                    kitStatus = 'Intact';
                    return resolve(kitStatus);
                } else {
                    s.isChecked(s.rowByKitId(kitId).element(s.damagedCheckboxLocator)).then(function(isChecked) {
                        if (isChecked) {
                            kitStatus = 'Damaged';
                            return resolve(kitStatus);
                        } else {
                            s.isChecked(s.rowByKitId(kitId).element(s.lostCheckboxLocator)).then(function(isChecked) {
                                if (isChecked) {
                                    kitStatus = 'Lost';
                                    return resolve(kitStatus);
                                } else {
                                    return reject('Unable to find kit status');
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    getKitStatusByRowNumber(rowNumber: number): Promise<string> {
        let s = this;

        return new Promise((resolve, reject) => {
            s.isChecked(s.rowByNumber(rowNumber).element(s.intactCheckboxLocator)).then(function(isChecked) {
                if (isChecked) {
                    return resolve('Intact');
                } else {
                    s.isChecked(s.rowByNumber(rowNumber).element(s.damagedCheckboxLocator)).then(function(isChecked) {
                        if (isChecked) {
                            return resolve('Damaged');
                        } else {
                            s.isChecked(s.rowByNumber(rowNumber).element(s.lostCheckboxLocator)).then(function(isChecked) {
                                if (isChecked) {
                                    return resolve('Lost');
                                } else {
                                    return reject('Unable to find kit status');
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    async markAsIntact(kitId: string) {
        await this.rowByKitId(kitId).element(this.intactCheckboxLocator).click();
    }

    async markAsDamaged(kitId: string) {
        await this.rowByKitId(kitId).element(this.damagedCheckboxLocator).click();
    }

    async markAsLost(kitId: string) {
        await this.rowByKitId(kitId).element(this.lostCheckboxLocator).click();
    }

    private isChecked(element: EF) {
        return element.getAttribute('class').then(function(classes) {
            if (classes.split(' ').indexOf('md-checked') !== -1) {
                return true;
            } else {
                return false;
            }
        });
    }

   async enterTempDetail(detail: string, value: string): Promise<void> {
        let row = element(by.xpath('//td[contains(text(),"'+detail+'")]//ancestor::tr'));
        let inputField = row.element(by.css('input'));
        await inputField.clear();
        await inputField.sendKeys(value);
    }

    async enterTempMonitorID(id: string): Promise<void> {
        await this.temperatureMonitorField.clear();
        await this.temperatureMonitorField.sendKeys(id);
    }

}
