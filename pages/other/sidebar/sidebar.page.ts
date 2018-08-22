import { browser, by, EF, element, utils, waitClick, logger } from '../../../utils';

export class Sidebar {

    aboutLink: EF = element(by.id('menu_link_MENU_ABOUT'));
    depotExcursionLink: EF = element(by.id('menu_link_MENU_EXCURSION_DEPOT'));
    depotForecastingLink: EF = element(by.id('menu_link_MENU_FORECASTING_DEPOT'));
    depotSupplyLink: EF = element(by.id("menu_link_MENU_DEPOT_RESUPPLY"));
    forecastingLink: EF = element(by.id('menu_toggle_MENU_FORECASTING'));
    homeLink: EF = element(by.id('menu_link_MENU_HOME'));
    lotsLink: EF = element(by.id('menu_link_MENU_LOTS'));
    patientLink: EF = element(by.id('menu_link_MENU_PATIENTS'));
    siteResupplyLink: EF = element(by.id('menu_link_MENU_SITE_RESUPPLY'));
    reportsLink: EF = element(by.id("menu_link_MENU_REPORTS"));
    shipmentsLink: EF = element(by.id('menu_link_MENU_SHIPMENTS'));
    sidenavMenu: EF = element(by.xpath("//md-content[@role='navigation']/ul[@class='side-menu']"));
    supplyLink: EF = element(by.id('menu_toggle_MENU_SUPPLY'));
    siteInventoryLink: EF = element(by.id('menu_link_MENU_SITE_INVENTORY'));
    studyLink: EF = element(by.id('menu_toggle_MENU_STUDY'));
    cohortLink: EF = element(by.id('menu_link_MENU_COHORTS'));
    siteExcursionLink: EF = element(by.id('menu_link_MENU_EXCURSION_SITE'));
    excursionLink: EF = element(by.id('menu_link_MENU_EXCURSIONS'));
    orderSupplyLink: EF = element(by.id('menu_link_MENU_SITE_ORDERING'));
    sitesLink: EF = element(by.id('menu_link_MENU_SITES'));
    countriesLink: EF = element(by.id('menu_link_MENU_COUNTRIES'));

    async openPatientPage() {
        logger.debug("sidebar.page.openPatientPage");
        await waitClick(this.patientLink);
    }

    async openDepotForecastingPage() {
        logger.debug("sidebar.page.depotForcasting");
        if(!await this.depotForecastingLink.isDisplayed()) {
            await waitClick(this.forecastingLink);
        }
        await utils.screenshot("open-forecasting-link.png");
        await waitClick(this.depotForecastingLink);
        await browser.waitForAngular();
    }

    async openSupplyPage() {
        logger.debug("sidebar.page.openSupplyPage");
        await waitClick(this.supplyLink);
    }

    async openAboutPage(){
        logger.debug("sidebar.page.openAboutPage");
        await waitClick(this.aboutLink);
    }

    async openHomePage() {
        logger.debug("sidebar.page.openHomePage");
        await waitClick(this.homeLink);
    }

    async openLotsPage() {
        logger.debug("sidebar.page.openLotsPage");
        if(! await this.lotsLink.isDisplayed())
            await waitClick(this.supplyLink);
        await waitClick(this.lotsLink);
    }

    async openSiteResupplyPage() {
        logger.debug("sidebar.page.openResupplyPage");
        if( !await this.siteResupplyLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.siteResupplyLink);
    }

    async openReportsPage() {
        logger.debug("sidebar.page.openReportsPage");
        await waitClick(this.reportsLink);
    }

    async openCohortsPage() {
        logger.debug("sidebar.page.openCohortsPage");
        await waitClick(this.studyLink);
        await waitClick(this.cohortLink);
    }

    async openDepotExcursionPage() {
        logger.debug("sidebar.page.openDepotExcursionPage");
        if(!await this.depotSupplyLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.depotExcursionLink);
    }

    async openShipmentsPage(){
        logger.debug("sidebar.page.openShipmentsPage");
        if(!await this.shipmentsLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.shipmentsLink);
    }

    async openSiteExcursionPage(){
        logger.debug("sidebar.page.openSiteExcursionPage");
        if(!await this.siteExcursionLink.isDisplayed()){
           await waitClick(this.supplyLink);
        }
        await waitClick(this.siteExcursionLink);
        await utils.screenshot('site-excursion-page.png');
    }

    async openExcursionPage() {
        logger.debug("sidebar.page.openExcursionPage");
        if(!await this.excursionLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.excursionLink);
        await utils.screenshot('excursion-page.png');
    }
    
    async openSiteInventoryPage() {
        logger.debug("sidebar.page.openSiteInventoryPage");
        if(!await this.siteInventoryLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.siteInventoryLink);
    }

    async openOrderSupplyPage(){
        logger.debug("sidebar.page.openSupplyPage");
        if(!await this.orderSupplyLink.isDisplayed()){
            await waitClick(this.supplyLink);
        }
        await waitClick(this.orderSupplyLink);
    }

    async openSitePage(){
        logger.debug("sidebar.page.openSupplyPage");
        if(!await this.sitesLink.isDisplayed()){
            await waitClick(this.studyLink);
        }
        await waitClick(this.sitesLink);
    }

    async openCountriesPage() {
        logger.debug("sidebar.page.openCountriesPage");
        if(!await this.countriesLink.isDisplayed()){
            await waitClick(this.studyLink);
        }
        await waitClick(this.countriesLink);
    }
}