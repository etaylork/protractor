import { by, browser, EF, element, Page, sidebar, waitClick } from '../../utils';


export class CohortsPage extends Page {
    
    ancestorRow: string = "./ancestor::tr";
    rankInput: string = "//input[@name='cohort_rank']";

    //Page elements
    applyChangesButton = element(by.buttonText('Update Cohort'));
    confirmButton = element(by.buttonText('Confirm'));

    getRankField: (cohort: string) => EF = (cohort: string) =>
        this.elementWithText(cohort).element(by.xpath(this.ancestorRow + this.rankInput));

    //low-level functions
    async open(){
        await sidebar.openCohortsPage();
        return new CohortsPage();
    }

    async isCurrentPage(): Promise<boolean> {
        let url = await browser.getCurrentUrl();
        return url.indexOf("/study/cohorts") !== -1;
    }

    async updateRankField(cohort: string, rank: string){
        const editLink = element(by.linkText(cohort));
        await waitClick(editLink);

        let rankField = element(by.xpath(this.rankInput));
        await rankField.clear();
        await rankField.sendKeys(rank);
        await waitClick(this.applyChangesButton);
    }
}
