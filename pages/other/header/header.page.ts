import { waitClick, waitClickable, waitText, waitVisible } from '../../../utils';
import { browser, by, element, $ } from 'protractor';

export class Header {

    //page elements
    formElement = $('form[name="studySelect"]');
    studyDropdown = element(by.id('study_selector_dialog_open'));
    titleElement = element.all(by.css('[href="/home"]')).first();
    supportMenu = element(by.id('support_menu'));
    logoutLink = element(by.id("logout"));
    profileLink = element(by.binding('user.username'));
    currentStudy = element(by.model("ctrl.study"));
    userProfileLink = element(by.id("username"));

    async supportMenuIsPresent() {
        return await this.supportMenu.isPresent();
    }

    async profileLinkisPresent() {
        return await this.profileLink.isPresent();
    }
    
    //Low-level functions 
    async getNumCookies() {
        let cookieCount = await browser.manage().getCookies();
        return Number(cookieCount.length);
    }

    async loadHomePage() {
        await browser.driver.get(browser.baseUrl);
        await waitClickable(this.logoutLink);
    }
    async logout() {
        await waitClick(this.logoutLink);
    }

    async showsStudy(study: string) {
        let result = await waitText(this.currentStudy);
        return result.toLowerCase().indexOf(study) !== -1;
    }

    async isLoggedIn(user: string) {
        await waitVisible(this.profileLink, browser.params.timeout);
        let email = await waitText(this.profileLink);
        return await email.indexOf(user) >= 0;
    }
}
