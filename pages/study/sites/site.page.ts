import { browser, by, element, waitVisible, Page, sidebar } from '../../../utils';

export class SitePage extends Page {

    /* page elements */
    updateSiteButton = element(by.css('button[wz-next="ctrl.updateSite()"]'));

    async open(): Promise<Page> {
        await sidebar.openSitePage();
        return new SitePage();
    }

    async clearFilters(): Promise<void> {
        let filterCount = await this.tables.get(0).all(by.model('ctrl.inputFilters[path]')).count();
        for (let i = 0; i < filterCount; i++) {
            await browser.actions().mouseMove(this.columnFilters.get(i)).perform();
            await waitVisible(this.columnFilters.get(i));
            await this.columnFilters.get(i).clear();
        }

        await browser.actions().mouseMove(this.columnFilters.get(0)).perform();
    }
}