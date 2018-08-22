import { browser, by, ele, EF, logger, Page, sidebar, utils, v } from "../../../utils";

export class DashboardPage extends Page {

    // Page elements
    urlPath: string = "/home";
    titleElement: EF = ele(by.binding('STUDY_DASHBOARD_TITLE'));
    studyDashboard: EF = ele(by.css("ng-include[ng-if='ctrl.studyDashboard']"));
    supplyDashboard: EF = ele(by.css("ng-include[ng-if='ctrl.supplyDashboard']"));
    siteDashboard: EF = ele(by.css("ng-include[ng-if='ctrl.siteDashboard']"));

    // Low-level actions
    async open(): Promise<Page> {
        logger.debug("Opening home page");
        await sidebar.openHomePage();
        await utils.logStudy();
        return new DashboardPage();
    }

    async isCurrentPage() {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, this.urlPath)
    }
    // User-level actions

}
