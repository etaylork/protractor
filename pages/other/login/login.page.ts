import { browser, by, element, logger, Page, utils, v, waitClick,
    waitVisible, waitText } from '../../../utils';

export class LoginPage extends Page {

     emailField = element(by.model('email'));
     passwordField = element(by.model('password'));
     loginButton = element(by.id('login__submit'));
     titleElement = element(by.binding('LOGIN'));
     registerLink = element(by.id('register__link'));
     signInLink = element(by.id('login__link'));
     loginErrorMessage = element(by.id("login__error"));
     resetPasswordLink = element(by.id('forgot_password_link'));
     emailTextBox = element(by.name('email'));
     passwordTextBox = element(by.name('password'));
     supportMenu = element(by.id('support_menu'));
     failureMessage = element(by.xpath("//*[contains(text(),'Please contact Customer Excellence')]"))
     navBar = element(by.css("nav.md-nav-bar.navbar.no-print"));
    
    //Low-level actions 
    async isCurrentPage() {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, "/login");
    }

    getErrorMessage() {
        return waitText(this.loginErrorMessage);
    }

    public static getUrlPath(): string {
        return "login";
    }
    
    async typeEmail(keys:string) {
        await this.emailTextBox.sendKeys(keys);
    }

    async typePassword(keys: string){
        await waitVisible(this.passwordTextBox);
        await this.passwordTextBox.sendKeys(keys);
    }

    //User-Level actions 
    async open() {
        logger.debug("Opening login page");
        await browser.get(this.getPath());
        return new LoginPage();
    }

    async loginAs(email: string, password: string) {
        if(await utils.firstElement(this.emailField, this.failureMessage) == this.failureMessage){
            throw new Error("site has experienced a failure, please restart the site");
        }
        await this.emailField.clear();
        await this.emailField.sendKeys(email);
        await this.passwordField.clear();
        await this.passwordField.sendKeys(password);
        await waitClick(this.loginButton);
    }

    async clickPassResetLink() {
        await waitClick(this.resetPasswordLink);
    }

    getPath(): string {
        return browser.baseUrl;
    }
}
