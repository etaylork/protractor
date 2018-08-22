import { EF, utils, waitClick } from '../../../utils';
import { EventPage } from './';

export class Dosing extends EventPage {

    //Page elements
    dosingLink: EF = this.dropdownWithText('Dosage');

    //low-level functions
    async startDosing(action: string, level: string): Promise<void> {
        if (await this.dosingLink.isPresent()) {
            if (level) {

                    await waitClick(this.dosingLink);
                await waitClick(this.optionWithText(level));
                await utils.screenshot(this.formatActionString(action) + "-" + this.formatLevelString(level) + ".png");
            } else {
                await utils.screenshot(this.formatActionString(action) + ".png");
            }
        } else if (await utils.contains(action, "Final visit")) {
            await waitClick(this.dropdownWithText("How is the patient feeling today"));
            await waitClick(this.optionWithText(level));
            await utils.screenshot(this.formatActionString(action) + "-" + this.formatLevelString(level) + ".png");
        }
    }

    async finishBegin(action: string): Promise<void> {
        await waitClick(this.nextButton);
        await utils.screenshot(this.formatActionString(action) + "-review.png");
    }

    async finishReview(action: string): Promise<void> {
        await waitClick(this.submitButton);
        await utils.screenshot(this.formatActionString(action) + "-done.png");
    }

    async finishDone(action: string): Promise<void> {
        await waitClick(this.backToPatientsButton);
        await utils.screenshot(this.formatActionString(action) + "-completed.png");
    }

    formatActionString(action: string): string {
        return action.toLowerCase().replace(" ", "-");
    }

    formatLevelString(level: string): string {
        return level.replace(" ", "");
    }

    //high-level functions
    async dose(action: string, level: string): Promise<void> {
        await this.startDosing(action, level);
        await this.finishBegin(action);
        await this.finishReview(action);
        await this.finishDone(action);
    }

    async doseUntil(action: string, level: string, until: string): Promise<void> {
        await this.startDosing(action, level);
        if (utils.contains(until, "BEGIN")) return;
        await this.finishBegin(action);
        if (utils.contains(until, "REVIEW")) return;
        await this.finishReview(action);
        if (utils.contains(until, "DONE")) return;
        await this.finishDone(action);
    }
}