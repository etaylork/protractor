import { logger, UserRole, utils } from '../../../../utils';
import { Report } from '../';

export class UserLoginHistory extends Report {

    id: string = "User Login History";
    title: string = "USER_LOGIN_HISTORY_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.CSL:
                await utils.screenshot("ulhr-report-csl.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in user-login-history:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
