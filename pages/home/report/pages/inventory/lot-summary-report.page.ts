import { by, element, Err, expect, logger, Msg, sidebar, Str, UserRole,
    utils, waitClick } from '../../../../../utils';

import { Report, } from '../../';

export class LotSummaryReport extends Report {

    id: string = "Lot Summary Report";
    title: string = "COHORT_HISTORY_REPORT_TITLE";

    description: string = "Listing of lots";
    displaysDataScreenshotName: string = "lot-summary-report-hasData-supplyManager-report.png";
    reportsListScreenshotName: string = "lot-summary-report-reports-list.png";

    linkRow = element(by.linkText(this.id)).element(by.xpath("ancestor::tr"));
    reportIsUnblinding = this.linkRow.element(by.cssContainingText(Str.STAR, Str.UNBLINDING));
    reportDescription = this.linkRow.element(by.cssContainingText(Str.STAR, this.description));

    /**
     * TC-1541 requires validation while opening the report so we've overwritten it here
     * If this becomes common we'll integrate into main Reports open
     */
    async open(): Promise<boolean> {
        logger.debug(Msg.OPENING_REPORT(this.id));
        await sidebar.openReportsPage();
        try {
            await utils.screenshot(this.reportsListScreenshotName);
            expect(await this.reportIsUnblinding.isPresent()).to.be.true;
            expect(await this.reportDescription.isPresent()).to.be.true;
            await waitClick(element(by.linkText(this.id)));
            return true;
        } catch (e) {
            logger.debug(Err.FAILED_TO_OPEN_REPORT(this.id));
            return false;
        }
    }

    async hasRequiredData(user: UserRole, data: {}) {
        switch (user) {
            case UserRole.roles.SupplyManager:
                logger.debug(Msg.VALIDATING_TEST_DATA_FOR_USER(user.name))
                await utils.screenshot(this.displaysDataScreenshotName);
                return await this.displaysData(data);
            default:
            logger.info(Err.FAILED_TO_FIND_USER_IN_REPORT(user.name, this.id));
            return false;
        }
    }
}
