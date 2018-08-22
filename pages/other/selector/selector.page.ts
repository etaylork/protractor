import { $, by, element, browser, ElementFinder, Key, logger, waitClick,
    waitClickable, waitVisible, waitText, utils } from '../../../utils';

import { Header } from '../../../pages/other/header/header.page';
import { Page } from "../../page.page";
import { Validation } from "../validation/validation.page";

const headerPage: Header = new Header();

export class SelectorPage extends Page {

    studyDropdown = element(by.xpath("(//md-select)[1]"));
    siteDropdown = element(by.xpath("(//md-select)[2]"));
    submitButton = element(by.id("selector__submit"));
    selectorHead = element(by.id("selector_head"));
    checkbox = element(by.model("ctrl.save"));

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf('selector') !== -1;
    }

    async open(): Promise<Page> {
        logger.debug("Opening selector page");
        await browser.get(browser.baseUrl + 'selector');
        await browser.wait(this.submitButton.isPresent(), browser.params.timeout);
        return new SelectorPage();
    }

    // Low-level actions
    async openStudyDropdown() {
        await waitClick(this.studyDropdown)
        await browser.waitForAngular();
    }

    async openSiteDropdown() {
        await waitClick(this.siteDropdown);
    }

    // User-level actions
    async selectStudy(study: string) {
        browser.params.study = study;
        await browser.waitForAngular();
        let url = await browser.getCurrentUrl();
        if(await url.indexOf("selector") !== -1) {
            await this.selectStudyByName(study);
            await this.submit();
        }
    }

    async selectStudyByName(name: string) {
        await this.openStudyDropdown();
        let ele = await element(by.xpath("//md-option[@ng-value='study']/div[contains(text(),'"+name+"')]"));
        try {
            await waitClickable(ele, 5000);
        } catch (e) {
            await logger.info("Selector Page: failed to click study dropdown, trying again...");
            await browser.driver.navigate().refresh();
            await this.openStudyDropdown();
        }
        await waitClick(ele);
    }

    async selectSiteByName(name: string) {
        await this.openSiteDropdown();
        let ele = await element(by.xpath("//md-option//span[contains(text(),'"+name+"')]"));
        await waitClick(ele);
    }

    async submit(){
        await waitClick(this.submitButton);
        browser.ignoreSynchronization = true;
        let homeLink: ElementFinder = element(by.id('menu_link_MENU_HOME'));
        let firstElement = await utils.firstElement(this.submitButton, homeLink);
        if (await Validation.elementEquals(firstElement, this.submitButton)){
            await logger.info("Selector Page: failed to click submit button, trying again..., url="+await browser.getCurrentUrl());
            await waitClick(this.submitButton);
        } else if (await Validation.elementEquals(firstElement, homeLink)) {
            await logger.debug("made it to the home page successfully ");
        }
        browser.ignoreSynchronization = false;
    }

    async containsStudy(study:string) {
        if(study === 'manualShipment') {
            study = 'manualshipment';
        }
        await this.openStudyDropdown();
        let opt = await $('md-option[ng-value="study"]');
        await waitClickable(opt);
        let eles = await element.all(by.repeater("study in ctrl.studies"));
        for(let ele of eles) {
            if((await waitText(ele)).indexOf(study) !== -1) {
                await headerPage.logoutLink.sendKeys(Key.ESCAPE);
                return true;
            }
        }
        await headerPage.logoutLink.sendKeys(Key.ESCAPE);
        return false;
    }

    async handleSelectorPage(study:string, site:string) {
        try {
            await waitVisible(this.selectorHead);
            await this.selectStudyByName(study);
            if(site != "") {
                await this.selectSiteByName(site);
            }
            await this.submit();
        } catch(e) {
            //do nothing
        }
    }
}