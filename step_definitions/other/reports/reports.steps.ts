import { api, browser, by, element, ElementFinder, expect, waitClick, waitText, waitVisible, utils } from '../../../utils';
import { defineSupportCode, TableDefinition } from 'cucumber';
import { Report, PatientDetailReport } from '../../../pages/home/report/index';

const userSiteAccess = require('../../../pages/home/report/data/test-data-user_site_access.json');
const kits = require('../../../pages/home/report/data/kit-data.json');

defineSupportCode(({ Then, When }) => {

    When("I open the '{report}' report",
        async function (report: Report) {
            await report.open();
            this.report = report;
            utils.screenshot(utils.getReportName(this.report.id) + "-open.png");
        });

    When(/^I select (?:lot|code|cohort|site|shipment) '(.*?)'$/,
        async function (code: string) {
            this.lotCode = code;
            this.siteCode = code;
            await this.report.selectDropDownValue(code);
        });

    When(/^I select(?: the)?(?: country| patient| study site| temperature excursion ID| shipment report| resupply report| depot)? '(.*?)'(?: lot number)?(?: link)?$/,
        async function (linkText: string) {
            this.link = linkText;
            await browser.actions().mouseMove(element.all(by.linkText(linkText)).first()).perform();
            await waitClick(await element.all(by.linkText(linkText)).first());
        });

    When(/^I select kit '(.*?)'$/,
        async function (kit: string) {
            let kitObj: any;
            for (let key in kits) {
                if (kits.hasOwnProperty(kit))
                    kitObj = kits[key];
            }

            this.kitType = kitObj.type;
            this.kitCode = kit;
            this.siteCode = kit;
            await this.report.selectDropDownValue(kit);
        });

    When(/^I download CSV and PDF files for the report$/,
        async function () {
            this.PDF = await this.report.downloadPDF();
            this.CSV = await this.report.downloadCSV();
        });

    When(/^I download the PDF file$/,
        async function () {
            await this.report.downloadPDF();
        });

    When(/I clear all filters and select a different page on the table$/,
        async function () {
            await this.report.clearFilters();
            expect(await this.report.selectPage(1, 0, this.siteCode)).to.be.true;
        });

    When(/I select '(.*?)' patients to view per page$/,
        async function (patientRows: string) {
            await this.report.selectRowsPerPage(patientRows);
        });

    When(/^I use the '(.*?)' arrow to navigate to a different page$/,
        async function (button: string) {
            if (button == "next") {
                this.pageNumber = await this.report.advancePage();
            } else if (button == "back") {
                this.pageNumber = await this.report.backPage();
            }
        });

    When(/^I use the '(.*?)' arrow to navigate to a different page for table '(.*?)'$/,
        async function (button: string, table: number) {
            if (button == "next") {
                this.pageNumber = await this.report.advancePage(table);
            } else if (button == "back") {
                this.pageNumber = await this.report.previousPage(table);
            }
        });

    When(/^I select the back button$/,
        async function () {
            await waitClick(this.report.backButton);
        });

    When(/^I select a successful login date link$/,
        async function () {
            await utils.clickDateLink();
        });

    When(/^I open patient report '(.*?)'$/,
        async function (patient: string) {
            let report: Report = new PatientDetailReport();
            await waitClick(await this.report.elementLink(patient));
            await utils.screenshot('open-' + patient + '-report.png');
            this.link = patient;
            this.report = report;
        });

    Then(/^the link opens the correct '(.*?)'$/,
        async function (report: string) {
            await expect(await waitText(this.report.site_code)).to.contain(this.link);
            await expect(await waitText(this.report.headline)).to.contain(report);
            if (this.user.unblinded) {
                expect(await waitText(this.report.headline)).to.contain("Unblinding");
            } else {
                expect(await waitText(this.report.headline)).to.not.contain("Unblinding");
            }
            await waitClick(this.report.backButton);
        });

    Then(/^I am taken back to the reports lists$/,
        async function () {
            expect(await browser.getCurrentUrl()).to.contain('reports');
            await utils.screenshot("reportslist.png");
        });

    Then(/^I verify that I was navigated to a different page$/,
        async function () {
            let currentPage = await waitText(this.report.selectPageButton());
            await expect(Number(currentPage)).not.to.be.equal(this.pageNumber);
            await browser.actions().mouseMove(this.report.backArrow()).perform();
            await utils.screenshot("navigate-to-diff-page.png");
        });

    Then(/^the report is visible and shows no data$/,
        async function () {
            expect(await this.report.hasNoVisibleData(this.user)).to.equal(true);
        });

    Then("the '{report}' report is visible",
        async function (report: Report) {
            expect(await report.isVisible()).to.equal(true);
        });

    Then("the '{report}' report is visible and shows required data - '{data}'",
        async function doMyFunction (report: Report, data: {}, table: TableDefinition) {
            this.report = report;
            expect(await this.report.isVisible(), "report is visible").to.be.true;
            expect(await this.report.hasRequiredData(this.user, data, table),
                "report has required data").to.be.true;
            await utils.screenshot("report-" + report.id + "displayed.png");
        });

    Then("the '{report}' report is visible and shows accurate data - '{data}'",
        async function doMyFunction (report: Report, data: {}) {
            this.report = report;
            expect(await this.report.isVisible(), "report is visible").to.be.true;
            expect(await this.report.hasRequiredData(this.user, data), "report has required data").to.be.true;
            await utils.screenshot("report-" + report.id + "displayed.png");
        });

    Then(/^the report displays all meta data$/,
        async function (table: TableDefinition) {
            waitVisible(this.report.site_code);
            expect(await waitText(this.report.site_code)).to.contain(this.siteCode);
            expect(await this.report.verifyMetaData(table)).to.be.true;
            await utils.screenshot("metaData-displayed.png");
        });

    Then(/^displays '(\d+)' patients$/,
        async function (numPatients: number) {
            expect(await this.report.rows().count()).to.equal(numPatients);
            await utils.screenshot(this.report.id +"-displayPatients.png");
        });

    Then(/I am taken to that patients detail report$/,
        async function () {
            expect(await waitText(this.report.headline)).to.be.equal("Patient Detail Report");
        });

    Then(/^I verify that I am on page '(\d+)'$/,
        async function (pageNumber: number) {
            expect(Number(await waitText(this.report.selectPageButton()))).to.be.equal(pageNumber);
            await browser.actions().mouseMove(this.report.backArrow()).perform();
            await utils.screenshot("SDR-On-Page" + pageNumber + ".png");
        });

    When("I cannot open the '{report}' report",
        async function (report: Report) {
            expect(await report.open(5000)).to.be.false;
        });

    When(/^I configure the reports landscape to '(.*?)'$/,
        async function (landscape: string) {
            let url = 'test_api/reportlandscape';
            let data = '{"report":"' + this.report.title + '", "landscape":' + landscape + '}';
            await api.post(url, data);
        });

    Then(/^'(.*?)' has access to the sites that he or she is associated with only$/,
        async function (user: string) {
            expect(await this.report.verifySiteCodes(userSiteAccess, user)).to.be.true;
        });

    Then(/^I refresh the page and download the PDF$/,
        async function () {
            await browser.refresh();
            // not currently supported
            // await this.report.downloadPDF();
        });

    Then(/^the updated lot expiration date is displayed on the report$/,
        async function () {
            await this.report.selectDropDownValue(this.kitCode);
            await utils.screenshot('verify-updatedExpirationDate.png');
            expect(await this.report.getChangePerformedText()).to.contain('Expiry of lot updated to ' + this.date);
        });

    Then(/^the kit status updates to '(.*?)' in the report$/,
        async function (status: string) {
            await this.report.selectDropDownValue(this.kitCode);
            await utils.screenshot('verify-quarantine.png');
            expect(await waitText(this.report.statusHeaderField)).to.contain(status);
        });

    Then(/^the kit displays a dispensing action update for the patient$/,
        async function () {
            await this.report.selectDropDownValue(this.kitCode);
            await utils.screenshot("dispensed-kit.png");
            expect(await this.report.getChangePerformedText()).to.contain('Kit dispensed to patient');
        });

    Then("the '{report}' report is open",
        async function (report: Report) {
            await browser.waitForAngular();
            expect(await waitText(report.headline)).to.contain(report.id);
            await utils.screenshot(utils.getReportName(report.id) + "open.png");
        });

    Then("the '{report}' report is open for country/excursion/lot/patient/site/shipment/resupply/depot {string}",
        async function (report: Report, value: string) {
            let currentUrl = await browser.getCurrentUrl();
            await browser.waitForAngular();

            expect(await waitText(report.headline)).to.contain(report.id);
            expect(currentUrl).to.contain(value);
    });

    Then(/^the notification heading is displayed$/,
        async function () {
            expect(await this.report.notificationHeader.isDisplayed()).to.be.true;
            await utils.screenshot('report-notification-displayed.png');
        });

    When(/^I download the notification PDF$/,
        async function () {
            await waitClick(this.report.notifPdfButton);
        });

    When(/^I close the notification pop up$/,
        async function () {
            await waitClick(this.report.cancelButton);
        });

    Then(/^a new entry has not been added to the table$/,
        async function () {
            expect(await this.report.rows().count()).to.equal(1);
            utils.screenshot('extra-table-entry.png');
        });
        
    When(/^I click on a notification link$/,
        async function () {
            await waitClick(this.report.notificationLink);
            expect(await this.report.notificationHeader.isDisplayed()).to.be.true;
            await utils.screenshot('report-notification-displayed.png')
        });

    Then("the '{report}' report is listed",
        async function (report: Report) {
            this.report = report;
            let reportLink: ElementFinder = element(by.linkText(report.id));
            expect(await reportLink.isDisplayed()).to.be.true;
        });

    Then(/^the report description is displayed$/,
        async function(){
            expect(await this.report.getReportDescription()).to.contain(this.report.description);
        });

    Then(/^the report description does have the unblinded label displayed/,
        async function () {
            expect(await this.report.getReportDescription()).to.contain('UNBLINDING');
            await browser.actions().mouseMove(element(by.linkText(this.report.id))).perform();
            utils.screenshot("unblinding-report-is-listed.png");
        });
    
    Then(/^the report description does not have the unblinded label displayed/,
        async function () {
            expect(await this.report.getReportDescription()).to.not.contain('UNBLINDING');
            await browser.actions().mouseMove(element(by.linkText(this.report.id))).perform();
            utils.screenshot("report-is-listed.png");
        });
    
    Then(/^the data is accurate in the '(.*?)' column/,
        async function (column:string) {
            await this.report.verifyColumnData(column);
        });

    /**
     * Part of TC-1541 validation of bug Prancer-3874
     */
    Then(/^lot number is not a link$/,
        async function () {
            let lotNumber = element.all(by.cssContainingText("td", "LN1")).first();
            let isLink = async (linkElement: ElementFinder) =>
                (await linkElement.getTagName()).indexOf("a") !== -1;
            expect(await isLink(lotNumber)).to.be.false;
        });

    /**
     * Part of TC-1541 validation of bug Prancer-3874
     */
    Then(/^metadata does not contain a link$/,
        async function() {
            let count: number = await this.report.metaData.count();
            for(let i = 0; i < count; i++) {
                let entry = await this.report.metaData.get(i);
                let entryLink = entry.element(by.css("a"));
                expect(await entryLink.isPresent()).to.be.false;
            }
        });

    Then(/^the only shipments associated with the '(.*?)' role are displayed/,
        async function(user: string, table: TableDefinition){
            expect(await this.report.verifyDropDownValues(table)).to.be.true;
            await utils.screenshot(user.replace("", "-") + "-roles-displayed.png");
        });

    When(/^I sort column '(.*?)'$/,
        async function(column: string){
            let table: ElementFinder = await this.report.tables.first();
            this.sortColumn = column;
            this.sortedColumnData = await this.report.sortColumn(column, table);
        });

    Then(/^the column is sorted$/,
        async function(){
            expect(await this.report.verifySortedColumn(this.sortedColumnData, this.sortColumn)).to.be.true;
        });

    Then(/^the title of the report is '(.*?)'$/,
        async function(title: string){
            expect(await waitText(this.report.headline)).to.contain(title);
        });

    Then(/^'(.*?)' is displayed in the header headline$/,
        async function(headline: string){
            expect(await waitText(this.report.site_code)).to.contain(headline);
        });

    Then(/^the table of patients is displayed in descending order$/,
        async function(){
            expect(await this.report.validatePatientRowsInOrder("Patient")).to.be.true;
            await utils.screenshot("validate-patient-rows.png");
        });
});
