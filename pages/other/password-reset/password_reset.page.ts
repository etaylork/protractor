import { waitText } from '../../../utils';
import { by, element } from 'protractor';

export class PasswordResetPage {

    //Page elements  
    emailTextBox = element(by.id('reset_password_email'));
    titleElement = element.all(by.binding('PASSWORD_RESET_FORM')).first();
    submitButton = element(by.id('submit'));
    newPasswordMessage = element(by.binding('PW_RESET_EMAIL_HAS_BEEN_SENT'));

    //Low-level actions 
    async getTitleElement () {
        return await waitText(this.titleElement);
    }

    async typeEmail(keys:string){
        await this.emailTextBox.sendKeys(keys);
    }
}