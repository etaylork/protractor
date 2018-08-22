import { utils, logger, Report, UserRole } from '../';

export class AccountabilitySummaryReport extends Report {

    id: string = "Accountability Summary";
    title: string = "ACCOUNTABILITY_SUMMARY_TITLE";

    async hasRequiredData(user: UserRole, data: {}) {

        switch (user) {
            case UserRole.roles.CSL:
                await utils.screenshot("asr-report-csl.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in accountability summary report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }
}