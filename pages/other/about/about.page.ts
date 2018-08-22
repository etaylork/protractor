import { browser, by, EAF, EF, ele, logger, Page, sidebar, utils, v, waitText } from '../../../utils';

export class AboutPage extends Page {

    //Page elements
    titleElement: EF = ele(by.binding('Version Information'));
    firstSystem: EF = ele.all(by.repeater('system in ctrl.system.systemInfo')).first();
    systemNameElement: EF = this.firstSystem.element(by.binding('system.name'));
    systemInfoElements: EAF = this.firstSystem.all(by.repeater('prop in system.properties'));

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return v.containsText(url, "/about");
    }

    async open(): Promise<Page> {
        logger.debug("Opening about page");
        await sidebar.openAboutPage();
        await utils.logStudy();
        return new AboutPage();
    }

    //Low-level functions
    async getSystemName() {
        return await waitText(this.systemNameElement);
    }

    async getSystemInfo() {
        let length = await this.systemInfoElements.count();
        let systemInfoArr = []
        for(let i = 0 ; i < length; i++){
            let value = await waitText(this.systemInfoElements.get(i));
            systemInfoArr.push(value);
        }
        return systemInfoArr;
    }

    //User-level functions
}