import { waitClick, waitClickable, browser, by, element, EF, logger, Page, sidebar, utils, v, waitText } from '../../../utils';

export class SiteResupplyPage extends Page {

    runResupplyButton: EF = element(by.id("run_resupply_btn"));
    confirmationMessage: EF = element.all(by.xpath("//md-dialog/md-dialog-content/h2")).last();
    confirmResupplyButton: EF = element(by.xpath("//button[contains(text(),'Confirm')]"));
    prancerMessage: EF = element.all(by.xpath("//prancer-message/span/span[contains(text(),'completed')]")).last();
    declineButton:EF = element(by.css('button[ng-click="ctrl.declineShipmentRequest()"]'));
    backButton: EF = element(by.css('button[ng-click="ctrl.goBack()"]'));
    toShipmentsButton: EF = element(by.css('button[ng-click="ctrl.goToShipment()"]'));
    submitButton: EF = element(by.css('button[wz-next="ctrl.createShipment()"]'));

    async open(): Promise<Page> {
        await logger.debug("Opening resupply page");
        await sidebar.openSiteResupplyPage();
        await utils.logStudy();
        return new SiteResupplyPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, "supply/site-resupply");
    }

    async selectDropdownOption(dropdown:string, option:string) {
        await waitClick(element(by.xpath("//md-select[@name='" + this.translate(dropdown) + "']")));
        try {
            await browser.waitForAngular();
            let ele = this.optionWithText(option);
            await waitClickable(ele);
        } catch (e) {
            await logger.info("Resupply page: failed to click dropdown, trying again...")
            await utils.refresh();
            await waitClick(element(by.xpath("//md-select[@name='" + this.translate(dropdown) + "']")));
        }
        await waitClick(this.optionWithText(option));
    }

    async getDropdownText(dropdown:string) {
        dropdown = await this.translate(dropdown);
        return await waitText(element(by.xpath("//md-select[@name='" + dropdown + "']/md-select-value/span/div")));
    }

    async getResupplyDropdownState(dropdown:string) {
        let ele = await element(by.xpath("//md-select[@name='" + await this.translate(dropdown) + "']"));
        return (await ele.getAttribute("disabled")) ? "disabled" : "enabled";
    }

    async dropdownIsBlank(dropdown:string) {
        let ele = await element(by.xpath("//md-select[@name='" + await this.translate(dropdown) + "']"));
        return (await ele.getAttribute("placeholder")).indexOf("Select a") >= 0;
    }

    public translate(text: string): string {
        if(text === 'pooling group') { return 'poolinggroup';  }
        if(text === 'level') { return 'option';  }
        if(text === 'Pooling group and depot') { return 'pgdepot'; }
        if(text === 'Pooling group and country') { return 'pgcountry'; }
        if(text === 'Pooling group and site') { return 'pgsite'; }
        return text;
    }
}