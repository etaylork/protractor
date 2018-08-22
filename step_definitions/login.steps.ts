import { expect, waitClick, waitText, utils } from '../utils';
import { browser, ExpectedConditions, element, by} from 'protractor'
import { defineSupportCode } from 'cucumber';

import { LoginPage } from '../pages/other/login/login.page';
import { Header } from '../pages/other/header/header.page';
import { UserRole } from '../utils/user.role';

const loginPage: LoginPage = new LoginPage();
const headerPage: Header = new Header();

defineSupportCode(({ Given,When,Then }) => {
    
    Given(/^'(.*?)' is logged in$/,
        async function (name: string) {
            try {
                let logout = element(by.id("logout"));
                await browser.wait(ExpectedConditions.elementToBeClickable(logout), 5000);
                await waitClick(logout);
            } catch (e) {
                //do nothing
            }
            await loginPage.open();
            this.user = UserRole.getUser(name);
            if (this.user === undefined)
                throw Error("user '" + name + "' does not exist");
            await loginPage.loginAs(this.user.email, this.user.password);
            expect(await headerPage.isLoggedIn(this.user.email)).to.be.true;
        });

    When(/^I enter my email and password$/, 
        async () => {
            await loginPage.loginAs(UserRole.roles.PrincipalInvestigator.email, UserRole.roles.PrincipalInvestigator.password);
        });

    When(/^I go to password reset page$/, 
        async () => {  
            await waitClick(loginPage.resetPasswordLink);
        });
        
    Then(/^I get rejected when I login with invalid credentials$/, 
        async () => {
              await loginPage.loginAs('super@4gclinical.com','lkdsajfije22');
              expect(await loginPage.loginErrorMessage.isDisplayed()).to.be.true;
            });

    Then(/^the login page has a support menu$/,
        async () =>{
            expect(await headerPage.supportMenu.isPresent()).to.be.true;
        });
    
    Then(/^login page has a email and password text box displayed$/,
        async () => {
            expect(await loginPage.emailTextBox.isPresent()).to.be.true;
            expect(await loginPage.passwordTextBox.isPresent()).to.be.true;
        });

    Then(/^has a submit button and a forgot password link displayed$/,
        async () => {
            expect(await loginPage.loginButton.isPresent()).to.be.true;
            expect(await loginPage.resetPasswordLink.isPresent()).to.be.true;
        });

    Then(/^the page accepts login with valid credentials$/,
        async () => {
            expect(await headerPage.profileLink.isPresent()).to.be.true;
        });

    Then(/^the support link is displayed$/,
        async function(){
            expect(await loginPage.supportMenu.isDisplayed()).to.be.true;
            await utils.screenshot("support-link-displayed.png");
        });
    
    Then(/^the sign in link is displayed$/,
        async function(){
            expect(await loginPage.signInLink.isDisplayed()).to.be.true;
            await utils.screenshot("sign-in-link-displayed.png");
        });

    Then(/^A header with client title '(.*?)' is displayed$/,
        async function(title: string){
            expect(await loginPage.navBar.isDisplayed()).to.be.true;
            expect(await waitText(loginPage.navBar)).to.contain(title);
            await utils.screenshot("client-title-displayed.png");
        });

});
