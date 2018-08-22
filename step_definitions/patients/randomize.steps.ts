import { browser, expect, waitClick, waitText, utils } from '../../utils';
import { defineSupportCode } from 'cucumber';

import { Sidebar } from '../../pages/other/sidebar/sidebar.page';
import { PatientPage } from '../../pages/other/patient/patient.page';
import { ScreenAPatientPage } from '../../pages/other/patient/screen_a_patient.page';
import { randomizePatientPage } from '../../pages/other/patient/randomize_patient.page';
import { API } from '../../utils/api';

const sidebar: Sidebar = new Sidebar();
const randomizePage: randomizePatientPage = new randomizePatientPage();
const patientPage: PatientPage = new PatientPage();
const screenAPatientPage: ScreenAPatientPage = new ScreenAPatientPage();
const api: API = new API();

defineSupportCode(({ When, Then }) => {

    When(/^I randomize a patient and note down the kit id$/,
        async function () {
            let url = await browser.getCurrentUrl();
            if (url.indexOf('patients') == -1) {
                await sidebar.openPatientPage();
            }

            await patientPage.clickRandomizeAPatient();

            //part 1: start
            expect(await randomizePage.header.isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            await waitClick(randomizePage.nextButton);

            //part 2: review 
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            await waitClick(randomizePage.submitButton);

            //part3: done
            await randomizePage.backToPatientsButton.isPresent();
            this.kitCode = await waitText(randomizePage.kit);
            await utils.screenshot('randomizedPatient-kitNumber.png')
            await waitClick(randomizePage.backToPatientsButton);

        });

    When(/^I randomize the patient$/,
        async () => {

            await patientPage.clickRandomizeAPatient();

            //part 1: Begin
            expect(await randomizePage.header.isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            await randomizePage.selectGender("male");
            await randomizePage.selectEyeColor("brown");
            await waitClick(randomizePage.nextButton);

            //part 2: Review
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            await waitClick(randomizePage.submitButton);

            //part 3: Done
            expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);

            //part 4: Check and Complete
            await waitText(randomizePage.resultMessage).then(async (text: string) => {
                expect(await text).to.match(/Successfully randomized patient/);
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
            });
            await waitClick(randomizePage.backToPatientsButton);
            expect(await randomizePage.screenAPatientButton.isPresent()).to.be.true;
            await utils.screenshot("finish-randomization.png");
        });

    When(/^I randomize patient '(.*?)'$/,
        async function(patientId: string) {
           await patientPage.clickPatientActionLink(patientId, "Randomize");

           //part 1: Begin
           expect(await randomizePage.header.isDisplayed()).to.be.true;
           expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
           await waitClick(randomizePage.nextButton);

           //part 2: Review
           expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
           await randomizePage.enterCredentials(this.user.email, this.user.password);
           await waitClick(randomizePage.submitButton);

           //part 3: Done
           expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
           expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);

           //part 4: Check and Complete
           await waitText(randomizePage.resultMessage).then(async (text: string) => {
               expect(await text).to.match(/Successfully randomized patient/);
           });

           await waitClick(randomizePage.backToPatientsButton);
           expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;
       });

    When(/^I randomize the patient with strata combo: eye-color = "(.*?)" , gender = "(.*?)"$/,
        async (color: string, gender: string) => {
            await waitClick(patientPage.randomizeAPatientButton);

            //part 1: Begin
            expect(await randomizePage.header.isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            await randomizePage.selectGender(gender);
            await randomizePage.selectEyeColor(color);
            await waitClick(randomizePage.nextButton);

            //part 2: Review
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            await waitClick(randomizePage.submitButton);

            //part 3: Done
            expect(await screenAPatientPage.stepSection(3).isDisplayed()).to.be.true;
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);

            //part 4: Check and Complete
            await waitText(randomizePage.resultMessage).then(async (text: string) => {
                expect(await text).to.match(/Successfully randomized patient/);
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
            });
            await waitClick(randomizePage.backToPatientsButton);
        });

    Then(/^the patient has been successfully randomized$/,
        async () => {
            await waitText(randomizePage.resultMessage).then(async (text: string) => {
                expect(await text).to.match(/Successfully randomized patient/);
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
            });
            await waitClick(randomizePage.backToPatientsButton);

        });

    Then(/^I check rand number '(\d+)' has been allocated to the patient on study '(.*?)'$/,
        async (randNum: number, study: string) => {
            let value = await api.post('test_api/randnumbercount', '{"study": "' + study + '"} ');
            expect(await randomizePage.checkRandNum(randNum, value)).to.be.true;
        });

    Then(/^I check that patient is on rand list "(.*?)" and allocated to rand number "(\d+)" on study "(.*?)"$/,
        async (randlist: string, randNum: number, study: string) => {
            let value = await api.post('test_api/randnumbercount', '{"study": "' + study + '"} ');
            expect(await randomizePage.verifyRandListAndNumber(randlist, randNum, value)).to.be.true;
        });

    Then(/^I check that the patient is on randlist "(.*?)", in randblock "(\d+)", and allocated to randnumber "(\d+)" on study "(.*?)"$/,
        async (randList: string, randBlock: number, randNum: number, study: string) => {
            let value = await api.post('test_api/randnumbercount', '{"study": "' + study + '"} ');
            expect(await randomizePage.verifyByRandListAndBlock(randList, randBlock, randNum, value)).to.be.true;
        });

    Then(/^I am redirected to the randomize review page$/,
        async function(){
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
            expect(await randomizePage.header.isDisplayed()).to.be.true;
        })

    Then(/^I am redirected to the randomize re-authentication page$/,
        async function(){
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
            expect(await randomizePage.passwordField.isDisplayed()).to.be.true;
            expect(await randomizePage.emailField.isDisplayed()).to.be.true;
        });

    Then(/^I am redirected to the randomzie completion page$/,
        async function(){
            expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
        });

    Then(/^a randomize event completion message is displayed$/,
        async function(){
            await waitText(randomizePage.resultMessage).then(async (text: string) => {
                expect(await text).to.contain('Successfully randomized patient');
                expect(await text).to.match(/Scheduled visit '.*?' is complete/);
                expect(await text).to.match(/Patient's next scheduled visit '.*?'  is due between/);
            });
        });

    Then(/^'(.*?)' '(.*?)' step is displayed$/,
        async function (action: string, step: string) {
            await utils.screenCapture(action, step);
            expect(await randomizePage.getEventTitle(), "header test").to.equal(action);
            expect(await waitText(randomizePage.currentStep), "step test").to.equal(step);
        });

   When(/^I remember the medication type$/,
       async function(){
           this.medicationType = await randomizePage.getMedicationType();
       });


    Then(/^the medication type is the same with '(.*?)'$/,
        async function(dose: string){
            expect(await randomizePage.getMedicationType()).to.equal(this.medicationType);
            expect(await randomizePage.getMedicationDose()).to.equal(dose);});

});

