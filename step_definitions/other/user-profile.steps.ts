import { browser, expect, waitText, waitVisible, utils } from '../../utils';
import { defineSupportCode, TableDefinition } from 'cucumber';

import { UserProfile } from '../../pages/other/user-profile/user_profile.page';

let userProfile: UserProfile = new UserProfile();

defineSupportCode(({ Then }) => {

    Then(/^trying to change to an invalid password throws an error$/,
        async (table: TableDefinition) => {
            for(let entry of table.hashes()) {
                await userProfile.changePassword(entry.new_password, entry.new_password, entry.new_password, entry.old_password);
                await utils.screenshot(entry.screenshot_name+".png");
                await waitVisible(userProfile.passwordNotValidErrorMessage);
                expect(await waitText(userProfile.passwordNotValidErrorMessage)).to.contain(entry.error_message);
            }
        });

    Then(/^trying to change to a valid password gives a confirmation message$/,
        async (table: TableDefinition) => {
            for(let entry of table.hashes()) {
                await userProfile.changePassword(entry.new_password, entry.new_password, entry.new_password, entry.old_password);
                browser.ignoreSynchronization = true;
                await utils.screenshot(entry.screenshot_name+".png");
                //toast messages use a timeout() function that interferes with protractors ability to search for an element
                browser.ignoreSynchronization = true;
                await waitVisible(userProfile.passwordConfirmationMessage);
                expect(await waitText(userProfile.passwordConfirmationMessage)).to.contain(entry.confirmation_message);
                browser.ignoreSynchronization = false;
            }
        });
});