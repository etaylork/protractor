import { UserRole, logger, utils } from '../../../../utils/';
import { Report } from '../';

export class SiteDetailReport extends Report {

    id: string = "Site Detail Report";
    title: string = "SITE_DETAIL_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("sdr-report-sup.png");
                return await this.displaysData(data);
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("sdr-report-si.png");
                return await this.displaysData(data);
            case UserRole.roles.CSL:
                await utils.screenshot("sdr-report-si.png");
                return await this.displaysData(data) && await this.isUnblinded();
            default:
                logger.info("Couldn't match user in site-detail-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }

    async hasNoVisibleData(user: UserRole): Promise<boolean> {
        let result: boolean = await super.hasNoVisibleData();
        switch(user){
            case UserRole.roles.CSL:
                return result && this.isUnblinded();
            case UserRole.roles.StudyManager:
            case UserRole.roles.PrincipalInvestigator:
                return result;
            default:
                logger.debug('no user was selected for site details report: hasNoVisibleData()');
                return false;
        }
    }
}
