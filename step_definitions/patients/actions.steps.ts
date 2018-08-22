import { expect, waitClick, waitText, TableDefinition, utils } from '../../utils';
import { TableValidation } from '../../pages';

import { PatientPage, ScreenFailPatientPage, ReturnKitAction } from '../../pages/other/patient';

const screenFailPatientPage: ScreenFailPatientPage = new ScreenFailPatientPage();
const patientPage: PatientPage = new PatientPage();
const returnKitPage: ReturnKitAction = new ReturnKitAction();

const { When, Then } = require('cucumber');

When(/^I second dose patient '(.*?)'$/,
    async function (patientId: string) {
        await patientPage.clickPatientActionLink(patientId, 'Second dosing');

        //begin
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
        expect(await waitText(patientPage.header)).to.contain("Second dosing - Patient");
        expect(await patientPage.cancelButton.isDisplayed()).to.be.true
        await utils.screenshot("second-dosing-begin-page.png");
        await waitClick(patientPage.nextButton);

        //review
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
        expect(await patientPage.backButton.isDisplayed()).to.be.true;
        await utils.screenshot("second-dosing-review-page.png");
        await waitClick(patientPage.submitButton);

        //done
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
        expect(await patientPage.backToPatientsButton.isDisplayed()).to.be.true;
        await waitText(patientPage.resultMessage).then(async (text: string) => {
            this.secondDosingMessage = text;
        });
        this.secondDosingErrorIcon = (await utils.status(patientPage.notifyErrorIcon)).displayed;
        await utils.screenshot("second-dosing-done-page.png");
    });

When(/^I screen fail the patient for '(.*?)'$/,
    async function (reason: string) {

        await patientPage.selectPatientAction("Screen Fail", this.patientRow);
        await utils.screenshot('selected-screen-fail-action.png');

        //Begin
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_unchecked', 'radio_button_unchecked']);
        expect(await screenFailPatientPage.screenFailField.isDisplayed()).to.be.true;
        await screenFailPatientPage.enterScreenFailedReason(reason);
        await waitClick(patientPage.nextButton);

        //Review
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_unchecked']);
        expect(await waitText(screenFailPatientPage.screenFailedReasonMessage)).to.contain(reason);
        await waitClick(patientPage.submitButton);

        //Done
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
        await waitText(screenFailPatientPage.resultMessage).then(async (text: string) => {
            expect(await text).to.match(/Unscheduled visit '.*?' is complete/);
        });
        await waitClick(patientPage.backToPatientsButton);
    });

When(/^I take note of the '(.*?)' kit ID on the return kit form$/,
        async function(status: string){
            if( status === "Second dosing")
                this.secondDoseKitID = await returnKitPage.getKitID(status);
            else if( status === "Randomize")
                this.randomizeKitID = await returnKitPage.getKitID(status);
        });

When(/^I enter the following details on the return kit form$/,
    async function(table: TableDefinition){
        
        for(let entry of table.hashes()){

            if(entry['Details'] == "Notes") 
                await returnKitPage.enterInputField(returnKitPage.addCommentField, entry['Values']);
            else if(entry['Details'] == "Tick box" && entry['Values'] == "checked") 
                await waitClick(returnKitPage.missingCheckbox);
            else
                await returnKitPage.enterDetail(entry['Details'], entry['Values']);
        }
    }); 

When(/^I click the next button on the define quantities to return page$/,
    async function(){
        await waitClick(returnKitPage.defineQuantitiesNextButton);
    });

Then(/^second dosing failed for the patient with an error message: '(.*?)'$/,
    async function (message: string) {
        expect(this.secondDosingErrorIcon).to.be.true;
        expect(this.secondDosingMessage).to.contain(message);
    });

Then(/^a second dosing success message for '(.*?)' supply is displayed$/,
    async function (supply: string) {
        expect(this.secondDosingMessage).to.match(/Scheduled visit '.*?' is complete/);
        expect(this.secondDosingMessage).to.match(/Patient's next scheduled visit '.*?'  is due between (.*?) and (.*?)/);
        if (supply == "discrete")
            expect(this.secondDosingMessage).to.match(/Please dispense the following discrete kits to patient (.*?)/);
        else if (supply == "bulk")
            expect(this.secondDosingMessage).to.match(/Please dispense the following bulk supply to patient (.*?)/);
    });

When(/^I discontinue the patient$/,
    async function () {
        await patientPage.selectPatientAction('Discontinue Patient', this.patientRow);

        //Step 1:Start Page
        await waitClick(patientPage.nextButton);

        //Step 2:Review Page
        await waitClick(patientPage.submitButton);

        //Step 3:Confirmed Page
        expect(await patientPage.getStepsStatus()).to.eql(['radio_button_checked', 'radio_button_checked', 'radio_button_checked']);
        await waitText(patientPage.resultMessage).then(async (text: string) => {
            expect(await text).to.contain("Discontinue Patient");
            expect(await text).to.contain("is complete");
        });

        await utils.screenshot('discontinue-process-complete.png');
        await waitClick(patientPage.backToPatientsButton);
        expect(await patientPage.screenAPatientButton.isPresent()).to.be.true;
    });

Then(/^a table with only (?:one of these|one) (?:discrete|bulk) supply is displayed$/,
    async function (table: TableDefinition) {
        let data = await utils.tableToJsonStrObj(table);
        expect(await patientPage.tableBodyRows.count()).to.equal(1);
        expect(await TableValidation.containsOneOf(patientPage.table, data)).to.be.true;
    });

Then(/^a table with (?:unblinded|blinded) supply is displayed/,
    async function (table: TableDefinition) {
        let data = await utils.tableToJsonStrObj(table);
        expect(await patientPage.tableBodyRows.count()).to.be.greaterThan(1);
        expect(await TableValidation.validateTable(patientPage.table, data)).to.be.true;
    });

Then(/^input fields are available for used, returned, and missing columns$/,
        async function(){
            expect(await returnKitPage.validateInputFields()).to.be.true;
        });

Then(/^there is a check box for Tick box if whole kit missing field$/,
    async function(){
        expect(await returnKitPage.missingCheckbox.isDisplayed()).to.be.true;
    });

Then(/^the input fields for used, returned, and missing columns are empty$/,
    async function(){
        expect(await returnKitPage.validateEmpyInputFields()).to.be.true;
    });

Then(/^the missing quantity field shows '(.*?)'$/,
    async function(quantity: string){
        expect(await returnKitPage.getMissingQuantityAmount()).to.equal(quantity);
    });