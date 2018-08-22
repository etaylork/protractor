import { Page, waitClick, waitVisible, v } from '../../../utils';
import { browser, by, element } from 'protractor';
import { Header } from '../header/header.page';
import { logger } from '../../../utils/logger';

const headerPage: Header = new Header();

export class UserProfile extends Page {

    headline = element(by.id("user_profile"));
    systemAccessTab = element(by.name("systemAccessForm"));
    systemAccessLink = element(by.cssContainingText('md-tab-item','System Access'));
    firstPasswordField = element(by.model("user.first_password"));
    secondPasswordField = element(by.model("user.second_password"));
    passwordHint = element(by.model("user.password_hint"));
    currentPassword = element(by.model("user.current_password"));
    submitChangesButton = element(by.id("user_system_access_submit_btn"));
    passwordNotValidErrorMessage = element(by.binding("system_access_error"));
    passwordConfirmationMessage = element(by.binding("msg"));

    //low-level functions
    async open() {
        await logger.debug("Opening profile page");
        await waitClick(headerPage.userProfileLink);
        await waitVisible(this.headline);
        return new UserProfile();
    }

    async isCurrentPage() {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, "profile");
    }

    //high-level functions
    async changePassword(firstPassword: string, secondPassword: string, hint: string, current: string): Promise<void> {
        await this.firstPasswordField.clear();
        await this.firstPasswordField.sendKeys(firstPassword);
        await this.secondPasswordField.clear();
        await this.secondPasswordField.sendKeys(secondPassword);
        await this.passwordHint.clear();
        await this.passwordHint.sendKeys(hint);
        await this.currentPassword.clear();
        await this.currentPassword.sendKeys(current);
        await waitClick(this.submitChangesButton);
    }
}