import { waitClick, waitVisible, Page, utils} from '../../../utils';
import { defineSupportCode } from 'cucumber';

import { UserProfile } from '../../../pages/other/user-profile/user_profile.page';

const userProfilePage: UserProfile = new UserProfile();

defineSupportCode(({ Given }) => {

    Given("I am on the '{page}' page",
        async function (page: Page) {
            this.page = page;
            await utils.screenshot("opening-"+page.constructor.name+"-page.png");
        });

    Given(/^I am on the '(profile)' page and on the '(Contact Information|System Access|Roles Definition|Alert Settings|Notification Settings)' tab$/,
        async (page: string, tab: string) => {
            switch (page) {
                case 'profile': {
                    await userProfilePage.open();

                    switch (tab) {
                        case 'Contact Information': {
                            break;
                        }
                        case 'System Access': {
                            await waitClick(userProfilePage.systemAccessLink);
                            await waitVisible(userProfilePage.systemAccessTab);
                            break;
                        }
                        case 'Roles Definition': {
                            break;
                        }
                        case 'Alert Settings': {
                            break;
                        }
                        case 'Notification Settings': {
                            break;
                        }
                        default: {
                            throw Error("Unsupported profile page tab: " + tab);
                        }
                    }
                    break;
                }
                default: {
                    throw Error("Unsupported page: " + page);
                }
            }
        });
});