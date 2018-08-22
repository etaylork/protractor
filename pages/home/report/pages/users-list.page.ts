import { logger, utils, UserRole} from '../../../../utils';
import { Report } from '../';

export class UsersList extends Report {

    id: string = "Users List";
    title: string = "USERS_REPORT";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("ul-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.SiteMonitor:
                await utils.screenshot("ul-report-smon.png");
                return await this.displaysData(data);
            case UserRole.roles.CSL:
                await utils.screenshot("ul-report-csl.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in user-list-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
