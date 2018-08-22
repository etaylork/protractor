
import { by, element, EF, logger, Page, sidebar, utils, TableDefinition, waitClick, waitText } from "../../../utils";
import { CountriesPage } from "./countries.page";


export class AddCountryPage extends CountriesPage {
    
    /* page elements */
    title: EF = element(by.css("h1.md-headline.prancer-title.text-center"));
    countryDropDown: EF = element(by.model('ctrl.model.country'));
    screeningOpenDropDown: EF = element(by.model('ctrl.model.screening_open')).element(by.css('md-select'));
    randomizeOpenDropDown: EF = element(by.model('ctrl.model.randomization_open')).element(by.css('md-select'));
    regionDropDown: EF = element(by.model('ctrl.model.region')).element(by.css('md-select'));
    countryStatusDropDown: EF = element(by.model('ctrl.model.country_status')).element(by.css('md-select'));
    screeningCapField: EF = element(by.model('ctrl.model.screen_cap')).element(by.css('input'));
    randomizeCapField: EF = element(by.model('ctrl.model.rand_cap')).element(by.css('input'));
    forecastedNumberOfSitesField: EF = element(by.model('ctrl.model.fcast_num_sites')).element(by.css('input'));
    forcastedSitesActivatedMonthlyField: EF = element(by.model('ctrl.model.fcast_sites_activated_per_month')).element(by.css('input'));
    forcastedPatientsSiteAndMonthField: EF = element(by.model('ctrl.model.fcast_patient_arrival_per_month')).element(by.css('input'));
    createCountryButton: EF = element(by.css('button[wz-next="ctrl.createCountry()"]'));
    updateCountryButton: EF = element(by.css('button[wz-next="ctrl.updateCountry()"]'));

    async open(): Promise<Page> {
        await sidebar.openCountriesPage();
        await waitClick(this.addCountryButton);
        return new AddCountryPage();
    }

    async inputCountryDetailsHandler(table: TableDefinition): Promise<void> {
        let detailValues: {} = table.hashes()[0];
        let keys: string[] = Object.keys(detailValues);

        for(let i = 0; i < 5; i++){
            try{
                for(let i = 0; i < keys.length; i++){
                    let ele: EF = this.getDetailsLocatorByString(keys[i]);
                    if( await ele.getTagName() == 'input')
                        await this.enterInputField(ele, detailValues[keys[i]]);
                    else
                        await this.selectDropoDownValue(ele, detailValues[keys[i]]);
                }
                break;
            }catch(e){
                logger.warn('loop '+ i + ' failed to click on drop down refreshing ');
                utils.refresh();
            }
        }
        return;
    }

    private getDetailsLocatorByString(detail: string): EF {
        
        switch(detail){
            case "Country" : 
                return this.countryDropDown;
            case "Region" : 
                return this.regionDropDown;
            case "Country status":
                return this.countryStatusDropDown;
            case "Screening Open?" :
                return this.screeningOpenDropDown;
            case "Randomization Open?" :
                return this.randomizeOpenDropDown;
            case "Screening cap" :
                return this.screeningCapField;
            case "Randomization Cap" :
                return this.randomizeCapField;
            case "Forecasted Number of Sites" :
                return this.forecastedNumberOfSitesField;
            case "Forecasted Sites Activated per Month":
                return this.forcastedSitesActivatedMonthlyField;
            case "Forecasted Patients per Site per Month":
                return this.forcastedPatientsSiteAndMonthField;
            default: return null;
        }
    }

    async verifyDetailsOnReviewPage(detail: string, value: string): Promise<boolean> {
        let detailField: EF = element(by.xpath("//span[contains(text(),'" + detail + "')]//ancestor::div"));
        let verifyText = await waitText(detailField);

        if (verifyText.indexOf(value) !== -1) {
            return true;
        } else {
            logger.error(value + " !== " + verifyText);
            return false;
        }
    }
}