import { by, element, EF, EFStrFunc, Page, sidebar, waitClick } from "../../../utils";

export class CountriesPage extends Page {

    /* page elements */
    addCountryButton : EF = element(by.css('button[ng-click="ctrl.addCountry()"]'));

    countryRandomizeSwitch: EFStrFunc = (country: string) =>
         element(by.linkText(country)).element(by.xpath('ancestor::tr')).element(by.model('country.randomization_open'));
    countryScreeningSwitch: EFStrFunc = (country: string) =>
         element(by.linkText(country)).element(by.xpath('ancestor::tr')).element(by.model('country.screening_open'));

    async open(): Promise<Page> {
        await sidebar.openCountriesPage();
        return new CountriesPage();
    }

    async changeScreeningStatus(country: string): Promise<void> {
        let countryRow: EF = element(by.linkText(country)).element(by.xpath('ancestor::tr'));
        await waitClick(countryRow.element(by.model('country.screening_open')));
        await waitClick(this.confirmButton);
    }

    async changeRandomizeStatus(country: string): Promise<void> {
        let countryRow: EF = element(by.linkText(country)).element(by.xpath('ancestor::tr'));
        await waitClick(countryRow.element(by.model('country.randomization_open')));
        await waitClick(this.confirmButton);
    }



}