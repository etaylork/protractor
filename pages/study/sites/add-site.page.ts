import { browser, by, element, EF, logger, Page, sidebar, waitClick, waitText, utils, TableDefinition } from '../../../utils';
import { SitePage } from './site.page';
import { EFStrFunc } from '../../home/report/pages/report.page';

export class AddSitePage extends SitePage {

    /* page elements */
    addSiteButton: EF = element(by.css('button[ng-click="ctrl.addSite()"]'));
    siteNumberField: EF = element(by.model('ctrl.model.study_site_code')).element(by.model('ngModel'));
    investigatorNameField: EF = element(by.model('ctrl.model.investigator_name')).element(by.model('ngModel'));
    countryDropDown: EF = element(by.model('ctrl.model.address.country'));
    timeZoneDropDown: EF = element(by.model('ctrl.model.site.timezone'));
    deliverContactField: EF = element(by.model('ctrl.model.site.ship_to_name')).element(by.model('ngModel'));
    siteAddressField: EF = element(by.model('ngModel.address1')).element(by.model('ngModel'));
    secondAddressField: EF = element(by.model('ngModel.address2')).element(by.model('ngModel'));
    thirdAddressField: EF = element(by.model('ngModel.address3')).element(by.model('ngModel'));
    cityField: EF = element(by.model('ngModel.city')).element(by.model('ngModel'));
    stateField: EF = element(by.model('ngModel.state_prov')).element(by.model('ngModel'));
    zipCodeField: EF = element(by.model('ngModel.postal_code')).element(by.model('ngModel'));
    sitePhoneField: EF = element(by.model('ngModel.telephone')).element(by.css('input'));
    protocolDropDown: EF = element(by.model('ctrl.inputModel'));
    utilityDropDown: EF = element(by.model('ctrl.model.utility_field'));

    shippingAddressField: EF = element.all(by.model('ngModel.address1')).last().element(by.model('ngModel'));
    shippingSecondAddressField: EF = element.all(by.model('ngModel.address2')).last().element(by.model('ngModel'));
    shippingThirdAddressField: EF = element.all(by.model('ngModel.address3')).last().element(by.model('ngModel'));
    shippingCityField: EF = element.all(by.model('ngModel.city')).last().element(by.model('ngModel'));
    shippingStateField: EF = element.all(by.model('ngModel.state_prov')).last().element(by.model('ngModel'));
    shippingZipCodeField: EF = element.all(by.model('ngModel.postal_code')).last().element(by.model('ngModel'));
    shippingPhoneField: EF = element.all(by.model('ngModel.telephone')).last().element(by.css('input'));

    siteStatusDropDown: EF = element(by.model('ctrl.model.site_status'));
    screeningDropDown: EF = element(by.model('ctrl.model.screening_open'));
    randomizeDropDown: EF = element(by.model('ctrl.model.randomization_open'));
    screeningCapField: EF = element(by.model('ctrl.model.screen_cap')).element(by.model('ngModel'));
    randomizeCapField: EF = element(by.model('ctrl.model.rand_cap')).element(by.model('ngModel'));
    siteMonitorDropDown: EF = element(by.css('md-select[name="monitor"]'));
    diffShippingAddressCheckBox: EF = element(by.model('ctrl.differentShippingAddress'));
    destructionSiteCheckbox: EF = element(by.model('ctrl.model.allow_destruction_on_site'));

    siteCodeForm: EF = element(by.model('ctrl.model.study_site_code'));
    createSiteButton: EF = element(by.css('button[wz-next="ctrl.createSite()"]'));

    kits: EFStrFunc = (name: string) => element(by.repeater('ic in inventoryCaps')).element(by.xpath("//td[contains(text(),'" + name + "')]"));


    async open(): Promise<Page> {
        let url = await browser.getCurrentUrl();
        if (url.indexOf('study/sites') === -1) {
            await sidebar.openSitePage();
        }
        await waitClick(this.addSiteButton);
        return new AddSitePage();
    }

    async selectSiteMonitor(value: string): Promise<void> {
        await waitClick(this.siteMonitorDropDown, 15000, this.optionWithText(value));
        await waitClick(this.optionWithText(value));
        await waitClick(this.body);
    }

    async enterInventoryCap(kit: string, quantity: string): Promise<void> {
        let input = element(by.xpath('//*[contains(text(),"' + kit + '")]//ancestor::tr')).element(by.css('input'));
        await input.clear();
        await input.sendKeys(quantity);
    }

    async verifyDetailsOnReviewPage(detail: string, value: string): Promise<boolean> {
        let detailField = element(by.xpath("//span[contains(text(),'" + detail + "')]//ancestor::div"));
        let verifyText = await waitText(detailField);

        if (verifyText.indexOf(value) !== -1) {
            return true;
        } else {
            logger.error(value + " !== " + verifyText);
            return false;
        }
    }

    async verifyKitsOnReviewPage(kit: string, quantity: string): Promise<boolean> {
        let kitField = element.all(by.xpath("//*[contains(text(),'" + kit + "')]//ancestor::tr")).last();
        let verifyQuantity = await waitText(kitField);

        if (verifyQuantity.indexOf(quantity) !== -1) {
            return true;
        } else {
            logger.error(kit + ":" + quantity + " !== " + kit + ":" + verifyQuantity);
            return false;
        }
    }


    async editStudySiteDetails(table: TableDefinition): Promise<void> {

        for (let j = 0; j < 5; j++) {
            try {
                for (let i = 0; i < table.hashes().length; i++) {
                    let entry = table.hashes()[i];
                    await this.selectStudySiteDetails(entry['Details'], entry['Values']);
                }
                return;
            } catch (e) {
                await utils.refresh();
            }
        }

    }

    private async selectStudySiteDetails(details: string, value: string): Promise<void> {

        switch (details) {
            case "Time zone":
                await this.selectDropoDownValue(this.timeZoneDropDown, value);
                return;
            case "Site Monitor":
                await this.selectSiteMonitor(value);
                return;
            case "StudySite":
                await this.enterInputField(this.siteNumberField, value);
                return;
            case "Utility Field":
                await this.selectDropoDownValue(this.utilityDropDown, value);
                return;
        }
    }

}