import { waitClick, waitClickable, utils, logger } from '../../../utils';
import { $, by, element, browser } from 'protractor';

import { PatientPage } from './patient.page';
import { Sidebar } from '../sidebar/sidebar.page'
import { SelectorPage } from '../selector/selector.page';

const selectorPage: SelectorPage = new SelectorPage();
const sideBar: Sidebar = new Sidebar();

export class randomizePatientPage extends PatientPage {

    //Page elements
    year = element(by.className('text-pre'));
    resultMessage = $('div.steps');
    genderBox = element.all(by.model("ctrl.inputModel")).get(0);
    eyeColorBox = $("[aria-invalid='true']");
    kit = element(by.binding('dispensing.discrete_id'));

    //Low-level funtions
    async selectGender(gender: string) {
        if(!await this.genderBox.isPresent()) return;
        await waitClick(this.genderBox);
        let ele = await element(by.css("[value='" + gender + "']"));
        try {
            await waitClickable(ele);
        } catch (e) {
            await logger.info("Randomize Patient Page: failed to click gender selector drop down, trying again...");
            await utils.refresh();
            await selectorPage.selectStudyByName(browser.params.study);
            await selectorPage.selectSiteByName(browser.params.site);
            await selectorPage.submit();
            await sideBar.openPatientPage();
            await this.clickRandomizeAPatient();
            await waitClick(this.genderBox);
        }
        await waitClick(ele);
    }

    async selectEyeColor(color: string) {
        if(!await this.eyeColorBox.isPresent()) return;
        await waitClick(this.eyeColorBox);
        let ele = await element(by.css("[value='" + color + "']"));
        await waitClick(ele);
    }

    async checkRandNum(rand: number, obj: object) {
        let randNumbers = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                randNumbers.push(obj[key].rand_num);
            }
        }
        return (randNumbers.indexOf(rand) !== -1);
    }

    async verifyRandListAndNumber(randList: string, randNum: number, objArray: any) {
        let randNumbers = [];
        for (let key of objArray) {
            if (key.rand_list__rand_list_id == randList) {
                randNumbers.push(key.rand_num);
            }
        }
        logger.debug("" + randNumbers.indexOf(randNum));
        return (randNumbers.indexOf(randNum) !== -1);
    }

    async verifyByRandListAndBlock(randList: string, randBlock: number, randNum: number, objArray: any) {
        let randNumbers = [];
        for (let key of objArray) {
            if (key.rand_list__rand_list_id == randList && key.rand_block__block_num == randBlock) {
                randNumbers.push(key.rand_num);
            }
        }
        return (randNumbers.indexOf(randNum) !== -1);
    }

    async selectPatientRandomizeLink(patient:string): Promise<void> {
        let row = this.tableBodyRow(patient);
        let RandomizeLink = row.element(by.linkText("Randomize"));
        await waitClick(RandomizeLink);
    }

    async finishDone(): Promise<void> {
        await waitClick(this.backToPatientsButton);
    }
}