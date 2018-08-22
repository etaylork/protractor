import { logger, Report, TableDefinition, utils, UserRole } from '../';

export class AccountabilityDetailsReport extends Report {

    id: string =  "Accountability Details";
    title: string = "ACCOUNTABILITY_DETAILS_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition): Promise<boolean> {

        switch (user) {
            case UserRole.roles.CSL:
                await utils.screenshot("chr-report-csl.png");
                return await this.displaysData(data) && await this.verifyMetaData(table);
            default:
                logger.info("Couldn't match user in accountability detail report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }

    async hasNoVisibleData(user: UserRole): Promise<boolean> {

        switch(user){
            case UserRole.roles.CSL:
                await utils.screenshot("no-visible-data-displayed.png");
                return await this.isVisible() && (await this.siteDropdown.getText() == "");
            default: 
                logger.debug("Couldn't match user in accountability details report: hasNoVisibleData()");
                return false;
        }
    }
}