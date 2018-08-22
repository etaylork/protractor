import { $, by, browser, element, logger, sidebar, status, waitClick, waitText, waitVisible } from '../../../utils';

import { PatientPage } from './patient.page';
import { SelectorPage } from '../selector/selector.page';

const selectorPage: SelectorPage = new SelectorPage();

export class ScreenAPatientPage extends PatientPage {

    patientBirthYearField = element.all(by.model('ngModel')).first();
    ngModelCount = element.all(by.model('ngModel'));
    firstDateField = element(by.css('[data-code="date_first_symptoms"]')).element(by.css('[placeholder="Enter Date"]'));
    weightField = element(by.css('[data-code="weight"]')).element(by.model('ngModel'));
    commentField = element(by.css('[data-code="comment"]')).element(by.model('ngModel'));
    patientFeelingsField = element(by.css('[data-code="feeling"]')).element(by.model('ctrl.inputModel'));

    lastDateField = element(by.css('[data-code="datetime_last_dose"]')).element(by.css('[placeholder="Enter Date"]'));
    hoursField = element(by.css('[data-code="datetime_last_dose"]')).element(by.model("h"));
    minutesField = element(by.css('[data-code="datetime_last_dose"]')).element(by.model("m"));
    meridiemButton = element(by.css('[data-code="datetime_last_dose"]')).element(by.id("meridiem"));

    reviewMessage = element.all(by.css('[e2e-id="message"]'));

    errorMessage = element(by.binding('INVALID_MIN_NUM'));
    yearConfirmationText = element(by.binding('ctrl.strValue'));
    registrationConfirmationText = element.all(by.repeater('message in response.successes track by $index')).first();

    nextButton = element(by.buttonText('Next'));
    submitButton = element(by.buttonText('Submit'));
    backButton = element.all(by.buttonText('Back')).first();
    yesButton = element(by.css('[wz-next="ctrl.submit()"]'));

    stepSection = (stepNumber: any) => $(`div.steps > span > section:nth-child(${stepNumber})`);
    s1CancelButton = this.stepSection(1).$('.btn-back');
    s2BackButton = this.stepSection(2).$('button.btn-back');
    backToPatientsButton = element(by.css('a.btn-next'));
    stepsIndicator = $('div.steps-indicator');
    genderBox = element(by.css('[data-code="GENDER"]')).element(by.model('ctrl.inputModel'));
    genderBox2 = element(by.css('[data-code="gender"]')).element(by.model('ctrl.inputModel'));
    eyeColorBox = element(by.css('[data-code="EYECOLOR"]')).element(by.model('ctrl.inputModel'));

    // Study: e2e_study_01
    s1YobTextBox = $('[data-code^="yob"] > form > input');
    s2YobTextBox = $('[ng-if="ctrl.isString(value)"]');

    //Low-level functions
    async getYearConfirmationText() {
        let year = Number(await waitText(this.yearConfirmationText));
        return year;
    }

    async getRegistrationConfirmationText() {
        await waitText(this.registrationConfirmationText);
    }

    //User-level Functions 
    async enterPatientBirthYear(year: number): Promise<void> {
        if (!(await status(this.patientBirthYearField)).displayed) return;

        await this.patientBirthYearField.clear();
        await this.patientBirthYearField.sendKeys(year);
    }

    async enterWeight(year: string): Promise<void> {
        if (!(await status(this.weightField)).displayed) return;

        await this.weightField.clear();
        await this.weightField.sendKeys(year);
    }

    async enterDateFirstSymptoms(dateCode: string): Promise<void> {
        if (!(await status(this.firstDateField)).displayed) return;

        await this.firstDateField.clear();
        await this.firstDateField.sendKeys(dateCode);
    }

    async enterDateTimeLastDose(date: string, hours: string, mins: string, meridiem: string): Promise<void> {
        if (!(await status(this.lastDateField)).displayed) return;

        await this.lastDateField.clear();
        await this.lastDateField.sendKeys(date);
        await this.hoursField.clear();
        await this.hoursField.sendKeys(hours);
        await this.minutesField.clear();
        await this.minutesField.sendKeys(mins);
        let ele = element.all(by.css('[value="' + meridiem + '"]')).first();
        await waitClick(this.meridiemButton);
        await waitClick(ele);
    }

    async enterComment(comment: string): Promise<void> {
        if (!(await status(this.commentField)).displayed) return;

        await this.commentField.clear();
        await this.commentField.sendKeys(comment);
    }

    async selectGender(gender: string, ): Promise<void> {
        if((await status(this.genderBox2)).present){
            this.genderBox = this.genderBox2;
            gender = "Male";
        }
        else if (!(await status(this.genderBox)).displayed) return;

        let ele = await element.all(by.css("[value='" + gender + "']")).first();
        await waitClick(this.genderBox);
        await waitClick(ele);
    }

    async selectEyeColor(color: string): Promise<void> {
        if (!(await status(this.eyeColorBox)).displayed) return;

        let ele = await element.all(by.css("[value='" + color + "']")).first();
        await waitClick(this.eyeColorBox);
        await waitClick(ele);
    }

    async selectFeeling(feeling: string): Promise<void> {
        if (!(await status(this.patientFeelingsField)).displayed) return;

        let ele = await element.all(by.css("[value='" + feeling + "']")).first();
        await waitClick(this.patientFeelingsField);
        await waitClick(ele);
    }

    async enterPatientInfoOnStudy(): Promise<boolean> {

        //loop in case intermittent drop down click failure occurs
        for(let i = 0; i <= 5; i++) {
            try {
                await this.enterPatientBirthYear(browser.params.year);
                await this.enterDateFirstSymptoms("07-Nov-2017");
                await this.enterWeight("100");
                await this.enterComment("test");
                await this.selectGender("male");
                await this.selectEyeColor("blue");
                await this.enterDateTimeLastDose("07-Dec-2017", "04", "00", "PM");
                await this.selectFeeling("feeling good");
                return true
            } catch (e) {
                let header = 'Failure: screen-a-patient: enterPatientInfoOnStudy:';
                let message = 'intermitten drop down failure refreshing the page';
                logger.debug(header + " " + message);
                await this.refreshPage();
            }
        }

        return false;
    }

    async continue() {
        await waitClick(this.nextButton);
    }

    async verifyWarningMessage(level: number, glossary?: boolean) {
        let text;
        await waitVisible(this.resultMessage);

        switch (level) {
            case 1:
                text = await waitText(this.reviewMessage.get(2));
                return (text.indexOf("There are similar patients already screened in the system") !== -1);
            case 2:
                text = await waitText(this.reviewMessage.get(2));
                return (text.indexOf("Do you confirm that the patient is not a duplicate") !== -1);
            case 3:
                text = await waitText(this.reviewMessage.get(1));
                return (text.indexOf("There are similar patients already screened in the system.") !== -1);
            default:
                text = await waitText(this.reviewMessage.get(2));
                if (glossary) {
                    return (text.indexOf("Duplicate exists with matching ID's:") !== -1);
                }
                return (text.indexOf("There are similar patients already screened in the system") !== -1);
        }
    }

    //refresh()
    //refreshs the current page and redirects browser to screen a patient page
    async refreshPage(): Promise<void> {
        await browser.waitForAngular();
        await browser.refresh();
        await selectorPage.selectStudyByName(browser.params.study);
        await selectorPage.selectSiteByName(browser.params.site);
        await selectorPage.submit();
        await sidebar.openPatientPage();
        await this.clickScreenAPatient();
    }

}
