import { browser, expect, waitClick, waitText } from '../utils';
import { defineSupportCode } from 'cucumber';

import { StudySelector } from '../pages/other/header/study_selector.page';
import { Header } from '../pages/other/header/header.page';
import { SelectorPage } from '../pages/other/selector/selector.page';

const studySelector: StudySelector = new StudySelector();
const header: Header = new Header();
const selectorPage: SelectorPage = new SelectorPage();

defineSupportCode(({ Given, When, Then }) => {

    When(/^I open the study-selector dialog$/,
        async () => {
            await waitClick(header.studyDropdown);
        });

    When(/^I close the study-selector dialog$/,
        async () => {
            await studySelector.closeDialog();
        });

    Then(/^the study-selector dialog is displayed$/,
        async () => {
            expect(await studySelector.isDisplayed()).to.be.true;
        });

    Then(/^the study-selector dialog is not present$/,
        async () => {
            expect(await studySelector.isPresent()).to.be.false;
        });

    Then(/^the study-selector title is displayed$/,
        async () => {
            expect(await studySelector.titleIsDisplayed()).to.be.true;
        });

    Then(/^the study-selector study dropdown is displayed$/,
        async () => {
            expect(await studySelector.studyDropdownIsDisplayed()).to.be.true;
        });

    Then(/^the study-selector site dropdown is displayed$/,
        async () => {
            expect(await studySelector.siteDropdownIsDisplayed()).to.be.true;
        });

    Then(/^the study-selector remember checkbox is displayed$/,
        async () => {
            expect(await studySelector.rememberCheckboxIsDisplayed()).to.be.true;
        });

    Then(/^the study-selector select button is displayed$/,
        async () => {
            expect(await studySelector.selectbuttonIsDisplayed()).to.be.true;
        });

    Then(/^the study-selector cancel button is displayed$/,
        async () => {
            expect(await studySelector.cancelButtonIsDisplayed()).to.be.true;
        });

    When(/^I select the study "(.*?)"$/,
        async (study: string) => {
            //await studySelector.closeDialog();
            await studySelector.selectStudy(study);
        });

    Then(/^study-selector dropdown shows study "(.*?)"$/,
        async (study: string) => {
            expect(await header.showsStudy(study)).to.be.true;
        });

    When(/^I select the study site '(.*?)' on the study-selector dialog$/,
        async function (site: string) {
            this.site = site;
            await waitClick(header.studyDropdown);
            await studySelector.selectSite(site);
        });

    When(/^I select study '(.*?)' and site '(.*?)' on the study-selector dialog$/,
        async function (study: string, site: string) {
            this.study = study;
            this.site = site;
            await waitClick(header.studyDropdown);
            await studySelector.selectStudy(study);
            await studySelector.selectSite(site);
        });

    Given(/^I select study "(.*?)" and site "(.*?)" on the selector page$/,
        async function (study: string, site: string) {
            browser.params.study = study;
            browser.params.site = site;
            this.study = study;
            await selectorPage.selectStudyByName(study);
            await selectorPage.selectSiteByName(site);
            await selectorPage.submit();
        });

    Given(/^I test select study "(.*?)" and site "(.*?)" on the selector page$/,
        async (study: string, site: string) => {
            await selectorPage.selectStudyByName(study);
            await selectorPage.selectSiteByName(site);
            //await selectorPage.submit();
        });

    Given(/^I select study "(.*?)" only on the selector page$/,
        async function (study: string) {
            this.study = study;
            await selectorPage.selectStudy(study);
        });

    Then(/^I check that the study selector page has the right elements$/,
        async function(){
            expect(await selectorPage.studyDropdown.isDisplayed()).to.be.true;
            expect(await selectorPage.siteDropdown.isDisplayed()).to.be.true;
            expect(await selectorPage.checkbox.isDisplayed()).to.be.true;
            expect(await selectorPage.checkbox.getAttribute("class")).contains("ng-empty");
            expect(await selectorPage.submitButton.isEnabled()).to.be.false;
        });

    Then(/^the study dropdown with no study chosen is displayed$/,
        async function(){
            expect(await selectorPage.studyDropdown.isDisplayed()).to.be.true;
            expect(await waitText(selectorPage.studyDropdown)).to.equal("Study");
        });

    Then(/^the study site dropdown with no site chosen is displayed$/,
        async function(){
            expect(await selectorPage.siteDropdown.isDisplayed()).to.be.true;
            expect(await waitText(selectorPage.siteDropdown)).to.equal("StudySite");
        });

    Then(/^a unchecked 'remember my choice' check box is displayed$/,
        async function(){
            expect(await selectorPage.checkbox.isDisplayed()).to.be.true;
            expect(await selectorPage.checkbox.getAttribute("class")).contains("ng-empty");
        });

    Then(/^a disabled select button is displayed$/,
        async function(){
            expect(await selectorPage.submitButton.isDisplayed()).to.be.true;
            expect(await selectorPage.submitButton.isEnabled()).to.be.false;
        });
});