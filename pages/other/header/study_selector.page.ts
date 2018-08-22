import { by, element, waitClick } from '../../../utils';
import { Header } from '../../../pages/other/header/header.page';

const header: Header = new Header();

export class StudySelector {

    private studyDropdown = element(by.model('ctrl.study'));
    private studySiteDropdown = element(by.model('ctrl.site'));
    private selectButton = element(by.buttonText('Select'));
    private form = element(by.xpath("//form[@name='studySelect']"));
    private closeButton = element(by.xpath("//button[contains(text(),'Cancel')]"));
    private title = this.form.element(by.binding('SELECT_STUDY_AND_SITE'));
    private rememberCheckbox = this.form.element(by.id("context_remember_cb"));
    private cancelButton = this.form.element(by.binding('CANCEL'));

    public siteSelector = (site: string) => {
        return `//*[@ng-repeat="site in ctrl.studySites"]/div[contains(string(), "${site}")]`
    }

    public studySelector = (study: string) => {
        return `//*[@ng-repeat="study in ctrl.studies"]/div[contains(string(), "${study}")]`
    }

    async selectStudy(study: string) {
        if(!await this.studyDropdown.isPresent()) {
            await waitClick(header.studyDropdown);
        }
        await waitClick(this.studyDropdown);
        let studyElement = element(by.xpath(await this.studySelector(study)));
        await waitClick(studyElement);
    }

    async selectSite(site: string) {
        await waitClick(this.studySiteDropdown);
        let ele = await element(by.xpath(await this.siteSelector(site)));
        await waitClick(ele);
        await waitClick(this.selectButton);
    }

    async closeDialog() {
        await waitClick(this.closeButton);
    }

    async isDisplayed() {
        return await this.form.isDisplayed();
    }

    async isPresent() {
        return await this.form.isPresent();
    }

    async titleIsDisplayed() {
        return await this.title.isDisplayed();
    }

    async studyDropdownIsDisplayed() {
        return await this.studyDropdown.isDisplayed();
    }

    async siteDropdownIsDisplayed() {
        return await this.studySiteDropdown.isDisplayed();
    }

    async rememberCheckboxIsDisplayed() {
        return await this.rememberCheckbox.isDisplayed();
    }

    async selectbuttonIsDisplayed() {
        return await this.selectButton.isDisplayed();
    }

    async cancelButtonIsDisplayed() {
        return await this.cancelButton.isDisplayed();
    }
}
