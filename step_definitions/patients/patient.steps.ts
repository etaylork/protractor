import { by, element, expect, waitClick, waitVisible, waitText, TableDefinition, utils } from '../../utils';
import { defineSupportCode } from 'cucumber';

import { Sidebar } from '../../pages/other/sidebar/sidebar.page';
import { PatientPage } from '../../pages/other/patient/patient.page';
import { Dosing } from '../../pages';
import { randomizePatientPage } from '../../pages/other/patient/randomize_patient.page';

const randPage: randomizePatientPage = new randomizePatientPage();
const sidebar: Sidebar = new Sidebar();
const patientPage: PatientPage = new PatientPage();
const dosingPage: Dosing = new Dosing();

defineSupportCode(({ When, Then }) => {

    let message = (text: string) => element(by.xpath("//*[contains(text(),'" + text + "')]"));
    let count = (text: string) => element.all(by.xpath("//*[contains(text(),'" + text + "')]")).count();

    When(/^I click on patients$/,
        async () => {
            await sidebar.openPatientPage();
            expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;
        });

    When(/^I '(.*?)' the patient(?: with '(.*?)')?(?: until '(.*?)')?$/,
        async function(action: string, level: string, until: string){
            await waitClick(patientPage.visitLink(action));
            if (until) {
                await dosingPage.doseUntil(action, level, until);
            } else if (action === 'Visit 2') {
                let detailsTitle = element(by.binding("'PATIENT'"));
                await waitVisible(detailsTitle);

                let confirmationMessage = message("Please confirm");
                await waitVisible(confirmationMessage);

                let nextButton = element(by.buttonText('Next'));
                await waitClick(nextButton);

                let reviewMessage = message("Please review");
                await waitVisible(reviewMessage);

                let submitButton = element(by.buttonText('Submit'));
                await waitClick(submitButton);

                let finishMessage = message("Scheduled");
                await waitVisible(finishMessage);

                let dispenseMessage = message("Please dispense");
                await waitVisible(dispenseMessage);
            } else {
                await dosingPage.dose(action, level);
            }
        });

    When(/^I start(?: to)? '(.*?)' the patient(?: with '(.*?)')?$/,
        async function (action: string, level: string) {
            await waitClick(patientPage.visitLink(action));
            if(level) {
                await dosingPage.startDosing(action, level);
            }
        });

    When(/^I finish '(BEGIN|REVIEW|DONE)' step for '(.*?)' the patient(?: with '(.*?)')?$/,
        async function (step: string, action: string, level: string) {
            if (step == "BEGIN") {
                await dosingPage.finishBegin(action);
            } else if (step == "REVIEW") {
                await dosingPage.finishReview(action);
            } else if (step === "DONE") {
                await randPage.finishDone();
            }
        });

    Then(/^'(.*?)' form is not present$/,
        async function (action: string) {
            expect(await dosingPage.form(action).isPresent()).to.be.false;
        });

    Then(/^'(.*?)' field is not present$/,
        async function (action: string) {
            expect(await dosingPage.field(action).isPresent()).to.be.false;
        })

    When(/^I choose the '(.*?)' action with table$/,
        async function (action: string, table: TableDefinition) {
            switch(action){
                case "Return Kit": return patientPage.returnKitAction(this.patientRow, table);
                case "Replace Kit": return patientPage.replaceKitAction(this.patientRow, table);
            }
        });

    When(/^I choose the '(.*?)' action$/,
        async function (action: string) {
            await patientPage.selectPatientAction(action);
        });

    When(/^I enter valid credentials$/,
        async function(){
            await patientPage.enterCredentials(this.user.email, this.user.password);
        }); 

    When(/^I select the back to patients button$/,
        async function(){
            await waitClick(patientPage.backToPatientsButton);
        })

    Then(/^observe (\d+) lots from '(.*?)'$/,
        async (numLots: number, lot: string) => {
            expect(await count(lot)).to.equal(numLots);
        });

    Then(/^I '(.*?)' the patient fails$/,
        async (action: string) => {
            let visitLink = element.all(by.linkText(action)).first();
            await waitClick(visitLink);

            let detailsTitle = element(by.binding("'PATIENT'"));
            await waitVisible(detailsTitle);

            let confirmationMessage = message("Please confirm");
            await waitVisible(confirmationMessage);

            let nextButton = element(by.buttonText('Next'));
            await waitClick(nextButton);

            let reviewMessage = message("Please review");
            await waitVisible(reviewMessage);

            let submitButton = element(by.buttonText('Submit'));
            await waitClick(submitButton);

            let failMessage = message("sorry, something went wrong");
            await waitVisible(failMessage);

            let backButton = element(by.css("a.btn-next"));
            await waitClick(backButton);
        });

    Then(/^the custom title '(.*?)' is displayed$/,
        async function(title: string){
            expect(await waitText(patientPage.customTitle)).to.be.equal(title);
        });

    Then(/^the '(.*?)' action is displayed for the patient$/,
        async function(action: string){
            expect(await patientPage.verifyPatientAction(this.patientRow, action)).to.be.true;
            await utils.screenshot(action + '-is-displayed.png');
            await waitClick(patientPage.body);
        });

    Then(/^I see a list of patients$/,
        async function(){
            expect(await patientPage.tableBodyRows.count()).to.be.greaterThan(0);
            await utils.screenshot("patients-are-displayed.png");
        });

    Then(/^patient '(.*?)' is displayed in the list patients$/,
        async function(patient: string) {
            this.patientId = patient;
            this.patientRow = patientPage.tableBodyRow(patient);
            expect(await patientPage.linkIdentifier(patient).isDisplayed()).to.be.true;
            await utils.screenshot("list-of-patients-displayed.png");
        });

    Then(/^the status of the patient is '(.*?)'$/,
        async function(status: string){
            expect(await patientPage.getTableCellData(this.patientId, 1)).to.contain(status);
            await utils.screenshot(status+"-status-displayed.png");
        });

    Then(/^the next expected event for the patient is '(.*?)'$/,
        async function(event:string){
            expect(await patientPage.getTableCellData(this.patientId, 4)).to.contain(event);
            await utils.screenshot(event+"-next-event-displayed.png");
        });

    When(/^I '(.*?)' for patient '(.*?)'$/,
        async function(action: string, patientId: string){
            await patientPage.clickPatientActionLink(patientId, action);
        });

    Then(/^the return kit value shows as '(.*?)'$/,
        async function(kit: string){
            expect(await patientPage.getKitValue(this.patientRow)).to.equal(kit);
    });

});