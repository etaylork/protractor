import { expect, waitText } from '../../../utils';
import { AddCountryPage, CountriesPage, TableDefinition, waitClick } from '../../../pages';

const countriesPage: CountriesPage = new CountriesPage();
const addCountryPage: AddCountryPage = new AddCountryPage();


const { When, Then } = require('cucumber');


When(/^I enter the following details (?:for|to) (?:creating a country|update the country)$/,
    async function(table: TableDefinition){
        await addCountryPage.inputCountryDetailsHandler(table);
    });

When(/^I click the create country button$/,
    async function(){
        await waitClick(addCountryPage.createCountryButton);
    });

When(/^I click the edit country button$/,
    async function(){
        await waitClick(addCountryPage.updateCountryButton);
    });

When(/^I click the '(.*?)' switch for country '(.*?)'$/,
    async function(statusColumn: string, country: string){
        if(statusColumn == "screening open") 
            await countriesPage.changeScreeningStatus(country);
        else if(statusColumn == "randomize open")
            await countriesPage.changeRandomizeStatus(country);
    });

Then(/^the add country page is displayed$/,
    async function(){
        expect(await waitText(addCountryPage.title)).to.contain('Add a country');
    });

Then(/^the mandatory fields on the add country page will display red error messages$/,
    async function(){
        expect(await addCountryPage.verifyRequiredFieldErrMsg(addCountryPage.countryDropDown)).to.be.true;
        expect(await addCountryPage.verifyRequiredFieldErrMsg(addCountryPage.randomizeOpenDropDown)).to.be.true;
        expect(await addCountryPage.verifyRequiredFieldErrMsg(addCountryPage.screeningOpenDropDown)).to.be.true;
    });

Then(/^the (?:add|edit) country review screen dispalys all the details$/,
    async function(table: TableDefinition) {
        for( let entry of table.hashes()){
            expect (await addCountryPage.verifyDetailsOnReviewPage(entry['Details'], entry['Values'])).to.be.true;
        }
    });

Then(/^country '(.*?)' is listed on the countries page$/,
    async function(country: string){
        expect(await addCountryPage.linkIdentifier(country).isDisplayed()).to.be.true;
    });

Then(/^the screening open status for '(.*?)' is set to open$/,
    async function(country: string){
        expect(await countriesPage.countryScreeningSwitch(country).getAttribute('class')).to.contain('md-checked');
    });

Then(/^the randomize open status for '(.*?)' is set to open$/,
    async function(country: string){
        expect(await countriesPage.countryRandomizeSwitch(country).getAttribute('class')).to.contain('md-checked');
    });