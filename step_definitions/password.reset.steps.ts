import { expect, waitText } from '../utils';
import { defineSupportCode } from 'cucumber';

import { PasswordResetPage } from '../pages/other/password-reset/password_reset.page'

const PassResetPage : PasswordResetPage = new PasswordResetPage();

defineSupportCode(({ Then }) => {

    Then(/^check title is displayed and title matches '(.*?)'$/,
        async (title: string) =>{
            expect(await PassResetPage.titleElement.isDisplayed()).to.be.true;
            expect(await waitText(PassResetPage.titleElement)).to.equal(title); 
        });

    Then(/^submit button and email text box is displayed$/,
        async () => {
            expect(await PassResetPage.emailTextBox.isPresent()).to.be.true;
            expect(await PassResetPage.submitButton.isPresent()).to.be.true;
        });
});