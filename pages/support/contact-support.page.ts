import { by, element, EF, Page, TableDefinition, waitClick } from "../../utils";

export class ContactSupportPage extends Page {

    /*page elements*/
    emailForm: EF = element(by.css("form[name='emailForm']"));
    liveChatButton: EF = element(by.buttonText("Live Chat!"));
    sponsorField: EF = element(by.model("model.sponsor")).element(by.model("ngModel"));
    studyField: EF = element(by.model("model.study")).element(by.model("ngModel"));
    nameField: EF = element(by.model("model.user_full_name")).element(by.model("ngModel"));
    roleField: EF = element(by.model("model.user_role")).element(by.model("ngModel"));
    studySiteField: EF = element(by.model("model.study_site")).element(by.model("ngModel"));
    emailField: EF = element(by.model("model.user_email")).element(by.model("ngModel"));
    phoneNumberField: EF = element(by.model("model.user_phone")).element(by.model("ngModel"));
    messageField: EF = element(by.css("textarea[name='message']"));
    confirmationMessage: EF = element(by.css("span[ng-if='(!response.errors.length || displayAll) && response.successes.length']"));
    supportNumberListLink: EF = element(by.binding('SUPPORT_PHONE_LINK_DOWNLOAD_FILE'));
    supportHelpCenterLink: EF = element(by.binding('SUPPORT_HELP_CENTER_LINK'));

    /* iframe support live chat page elements */
    supportLiveChat: EF = element(by.css("iframe#chat-client-frame"));

    /* iframe co-browse with support page elements */
    coBrowseIframe: EF = element(by.xpath('//*[@id="P6BWWR9LQB-widget-frame"]'));
    coBrowseWindow: EF = element(by.css("html.background_transparent"));
    closeWindowIcon: EF = element(by.css("a.my-icon.myicon-close"));
    stopButton: EF = element(by.xpath("//button[contains(text(),'Stop')]"));

    async enterStudyField(study: string): Promise<void> {
        await this.studyField.clear();
        await this.studyField.sendKeys(study);
    }

    async enterSponsorField(sponsor: string): Promise<void> {
        await this.sponsorField.clear();
        await this.sponsorField.sendKeys(sponsor);
    }

    async enterNameField(name: string): Promise<void> {
        await this.nameField.clear();
        await this.nameField.sendKeys(name);
    }

    async enterRoleField(role: string): Promise<void> {
        await this.roleField.clear();
        await this.roleField.sendKeys(role);
    }

    async enterStudySiteField(studySite: string): Promise<void> {
        await this.studySiteField.clear();
        await this.studySiteField.sendKeys(studySite);
    }

    async enterEmailField(email: string): Promise<void> {
        await this.emailField.clear();
        await this.emailField.sendKeys(email);
    }

    async enterPhoneNumberField(number: string): Promise<void> {
        await this.phoneNumberField.clear();
        await this.phoneNumberField.sendKeys(number);
    }

    async enterMessageField(message: string): Promise<void> {
        await this.messageField.clear();
        await this.messageField.sendKeys(message);
    }

    async fillOutContactForm(table: TableDefinition): Promise<void> {
        for (let entry of table.hashes()) {
            await this.enterSponsorField(entry.sponsor);
            await this.enterNameField(entry.study);
            await this.enterNameField(entry.name);
            await this.enterRoleField(entry.role);
            await this.enterStudySiteField(entry.studySite);
            await this.enterEmailField(entry.email);
            await this.enterPhoneNumberField(entry.phoneNumber);
            await this.enterMessageField(entry.message);
            await waitClick(this.submitButton);
        }
    }
}