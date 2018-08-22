import { UserRole, utils } from '../../../../utils';
import { logger } from '../../../../utils/logger';
import { Report } from '../';

export class StudySitesReport extends Report {

    id: string = "Study Sites Report";
    title: string = "STUDY_SITES_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("ssr-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.SiteMonitor:
                await utils.screenshot("ssr-report-smon.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in study-sites-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}
