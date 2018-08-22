import { browser, expect, logger, utils, TableDefinition, waitClick, waitText } from '../utils';
import { defineSupportCode } from 'cucumber';

import { Header } from '../pages/other/header/header.page';
import { Sidebar } from '../pages/other/sidebar/sidebar.page';
import { LoginPage } from '../pages/other/login/login.page';
import { Report } from '../pages';
import { DashboardPage } from '../pages/other/base/home.page';

const dashBoardPage: DashboardPage = new DashboardPage();
const header: Header = new Header();
const sidebar: Sidebar = new Sidebar();

defineSupportCode(({ Given, Then, When }) => {
    
    Given(/^this is test run '(.*?)'$/,
        async function (test: number) {
           logger.info("this is test run number: " + test );
        });

    Given(/^I open the home page$/, 
            async () => {
                await header.loadHomePage();
            });  

    Then(/^there is a title$/,
        async () => {
            expect(await header.titleElement.isDisplayed()).to.be.true;
        });

    Then(/^there is a support menu$/, 
        async () => {
            expect(await header.supportMenu.isDisplayed()).to.be.true;
        });
    
    Then(/^there is a sidenav menu$/,
        async () => {
            expect(await sidebar.sidenavMenu.isDisplayed()).to.be.true;
        });

    Then(/^there are (.*?) cookies$/,
        async (numCookies: number) => {
            expect(await header.getNumCookies()).to.equal(Number(numCookies));
        });

    When(/^I log out$/,
        async () => {
            await header.logout();
        });

    Then(/^I log out successfully$/,
        async () => {
            let baseURL = browser.baseUrl;
            expect(await browser.getCurrentUrl()).to.equal(baseURL + await LoginPage.getUrlPath());
        })

    Then(/^I take a screenshot called "(.*?)"$/,
        async (imageName: string) => {
            await utils.screenshot(imageName+".png");
        });

    Given(/^I want to pass a test$/,
        async () => {
            expect(true).to.be.true;
        });

    Given(/^I want to fail a test$/,
        async () => {
            expect(true).to.be.false;
        })

    Then("the '{report}' table is visible on the home page and shows required data - '{data}'",
       async function doMyFunction (report: Report, data: {}, table: TableDefinition) {
        this.report = report;
        expect(await this.report.hasRequiredData(this.user, data, table),
            "report has required data").to.be.true;
        await utils.screenshot("report-" + report.id + "displayed.png");
    });

    When(/^I select the next button$/,
        async () => {
            await waitClick(dashBoardPage.nextButton);
        });

    When(/^I select the submit button$/,
        async function() {
            await waitClick(dashBoardPage.submitButton);
        }); 
    
    When(/^I refresh the page$/,
        async function () {
            await utils.refresh();
        });

    When(/^I select the '(.*?)' option from the support drop down menu$/,
        async function(option: string){
            await waitClick(header.supportMenu, 1500, dashBoardPage.linkOption("About"));
            await waitClick(dashBoardPage.linkOption(option));
        });

    Then(/^these options are presented in the support drop down menu:$/,
        async function(table: TableDefinition){
            await waitClick(header.supportMenu, 1500, dashBoardPage.linkOption("About"));
            for( let entry of table.hashes()){
                expect(await dashBoardPage.linkOption(entry.options).isDisplayed()).to.be.true;
            }
            await utils.screenshot("support-drop-down-options.png");
            await waitClick(dashBoardPage.body);
        });
    
    Then(/^the '(.*?)' dashboard is displayed$/,
        async function(dashboard: string){
            switch(dashboard){
                case "Study": 
                              expect(await dashBoardPage.studyDashboard.isDisplayed()).to.be.true;
                              return;
                case "Site": 
                              expect(await dashBoardPage.siteDashboard.isDisplayed()).to.be.true;
                              return;
                case "Supply":
                              expect(await dashBoardPage.supplyDashboard.isDisplayed()).to.be.true;
                              return;
            }
        });

    Then(/^the '(.*?)' dashboard is not displayed$/,
        async function(dashboard: string){
            switch(dashboard){
                case "Study": 
                                expect(await dashBoardPage.studyDashboard.isPresent()).to.be.false;
                                return;
                case "Site": 
                                expect(await dashBoardPage.siteDashboard.isPresent()).to.be.false;
                                return;
                case "Supply":
                                expect(await dashBoardPage.supplyDashboard.isPresent()).to.be.false;
                                return;
            }
        });
    
    Then(/^'(.*?)' is shown in the header$/,
        async function(studySite: string){
            expect(await waitText(header.studyDropdown)).to.equal(studySite);
        });
});  
