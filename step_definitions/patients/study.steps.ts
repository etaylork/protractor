import { browser, EF, Err, expect, waitClick, waitText, waitVisible, utils } from '../../utils';
import { defineSupportCode } from 'cucumber';

import { Header } from '../../pages/other/header/header.page';
import { Sidebar } from '../../pages/other/sidebar/sidebar.page';
import { StudySelector } from '../../pages/other/header/study_selector.page';
import { PatientPage } from '../../pages/other/patient/patient.page';
import { ScreenAPatientPage } from '../../pages/other/patient/screen_a_patient.page';

const header: Header = new Header();
const sidebar: Sidebar = new Sidebar();
const studySelector: StudySelector = new StudySelector();

const patientPage: PatientPage = new PatientPage();
const screenAPatientPage: ScreenAPatientPage = new ScreenAPatientPage();

defineSupportCode(({ Given, When, Then }) => {

    Given(/^I am on the '(.*?)' study and '(.*?)' site$/,
        async (study: string, site: string) => {
            await waitClick(header.studyDropdown);
            await studySelector.selectStudy(study);
            await studySelector.selectSite(site);
        });

    Given(/^the screen patient button is displayed$/,
        async () => {
            expect(await sidebar.patientLink.isPresent()).to.be.true;
        });

    When(/^I screen a patient(?:( successfully|))$/, { timeout: 300 * 1000 },
        async (validate: string) => {
            try {
                await waitVisible(sidebar.patientLink);
            } catch (e) {
                await waitClick(header.titleElement);
                await waitVisible(sidebar.patientLink);
            }
            await sidebar.openPatientPage();
            await patientPage.clickScreenAPatient();

            //Step 1:Start Page
            await screenAPatientPage.enterPatientInfoOnStudy();
            await screenAPatientPage.enterPatientBirthYear(1950);
            await waitClick(screenAPatientPage.nextButton);

            //Step 2:Review Page
            await waitClick(screenAPatientPage.submitButton);

            //Step 3:Confirmed Page
            expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
            await waitText(screenAPatientPage.resultMessage).then(async (text: string) => {
                expect(await text).to.contain('Successfully registered patient');
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
                expect(await text).to.match(/Patient's next scheduled visit '.*?'  is due between/);
            });
            await screenAPatientPage.backToPatientsButton.click();
            expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;
            await utils.screenshot("finish-screening.png");
        });

    When(/^I screen a patient born in (\d+)$/, { timeout: 300 * 1000 },
        async function (birthYear: number) {
            browser.params.year = birthYear;

            try {
                await waitVisible(sidebar.patientLink);
            } catch (e) {
                await waitClick(header.titleElement);
                await waitVisible(sidebar.patientLink);
            }

            await sidebar.openPatientPage();
            await browser.waitForAngular();
            await patientPage.clickScreenAPatient();

            //Step 1:Start Page
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            expect(await screenAPatientPage.s1YobTextBox.isPresent()).to.be.true;
            expect(await screenAPatientPage.s1CancelButton.isPresent()).to.be.true;
            expect(await screenAPatientPage.nextButton.isPresent()).to.be.true;
            await screenAPatientPage.enterPatientBirthYear(1000);
            await waitClick(screenAPatientPage.nextButton);
            expect(await screenAPatientPage.errorMessage.getText()).to.equal('Needs to be a numeric value, equal to, or higher than 1900.');
            await screenAPatientPage.enterPatientInfoOnStudy();
            await waitClick(screenAPatientPage.nextButton);

            //Step 2:Review Page
            expect(await screenAPatientPage.stepSection(2).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            await waitClick(screenAPatientPage.backButton);

            //Step 1:Start Page
            expect(await screenAPatientPage.stepSection(1).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            await screenAPatientPage.s1YobTextBox.clear();
            await screenAPatientPage.enterPatientBirthYear(birthYear);
            await waitClick(screenAPatientPage.nextButton);

            //Step 3:Review Page
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            await waitClick(screenAPatientPage.submitButton);

            //Step 3:Confirmed Page
            expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
            await waitText(screenAPatientPage.resultMessage).then(async (text: string) => {
                expect(await text).to.contain('Successfully registered patient');
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
                expect(await text).to.match(/Patient's next scheduled visit '.*?'  is due between/);
            });
            await waitClick(screenAPatientPage.backToPatientsButton);
            expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;

        });

    When(/^I begin to screen a patient born in '(\d+)'$/, { timeout: 300 * 1000 },
        async function (birthYear: number) {
            browser.params.year = birthYear;

            if (expect(await browser.getCurrentUrl()).to.not.contain('patients')) {
                await sidebar.openPatientPage();
            }

            await browser.waitForAngular();
            await patientPage.clickScreenAPatient();

            //Start page
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            await screenAPatientPage.enterPatientBirthYear(birthYear);
            await screenAPatientPage.enterPatientInfoOnStudy();
            await waitClick(screenAPatientPage.nextButton);
        });

    Then(/^a warning message is '(.*?)' on the review section$/,
        async function (displayed: string) {

            if (displayed == 'true' || displayed == 'displayed') {
                expect(await screenAPatientPage.verifyWarningMessage(this.warningLevel, this.glossary)).to.be.true;
            } else {
                expect(await screenAPatientPage.reviewMessage.count()).to.equal(2);
                expect(await waitText(screenAPatientPage.reviewMessage.get(1))).to.equal("Please review your changes.");
            }

            await utils.screenshot("warning-message-"+displayed.split(" ").join('-')+".png");
        });

    Then(/^the (.*?) is (.*?) and (.*?) on the review section$/,
        async function (buttonName: string, visible: string, enabled: string) {
            let button: EF;
            switch(buttonName) {
                case "yes":
                    button = screenAPatientPage.yesButton;
                    break;
                case "submit":
                    button = screenAPatientPage.submitButton;
                    break;
                default:
                    throw new Error(Err.COULD_NOT_FIND_SCREEN_PATIENT_BUTTON);
            }

            if(JSON.parse(visible))
                expect(await button.isDisplayed()).to.be.true;
            if(JSON.parse(enabled))
                expect(await button.isEnabled()).to.be.true;
        });

    Then(/^the number of patients increases by (\d+)$/,
        async (increaseCount: number) => {
            expect(await patientPage.getPatientRowCount()).not.be.lessThan(increaseCount);
        });

    Then(/^I continue to screen the patient$/,
        async function () {
            await waitClick(screenAPatientPage.submitButton);
            expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
            await waitClick(screenAPatientPage.backToPatientsButton);
            expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;
        });

});
