import { Page, sidebar } from '../../../utils';
import { DepotExcursionPage } from './depot-excursion.page';

export class SiteExcursionPage extends DepotExcursionPage{

    async open(): Promise<Page> {
        await sidebar.openSiteExcursionPage();
        return new SiteExcursionPage();
    }
}