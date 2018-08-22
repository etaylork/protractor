import { AddLotData } from '../../supply/lots/processes/add-lot.process';
import { AddSubLotData } from '../../supply/lots/';
export interface Step {
    visit(data: AddLotData): Promise<Step>;
}

export interface SubLotStep {
    visit(data: AddSubLotData): Promise<SubLotStep>;
}