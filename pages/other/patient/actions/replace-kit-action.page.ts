import { PatientKitData, PatientKitStep } from '../interfaces/patient-kit-data.interface';
import { KitReplaceBeginPage } from '../steps'
import { Process } from '../../process';
export class ReplaceKitAction implements Process {

    data: PatientKitData;

    constructor(data: PatientKitData) {
        this.data = data;
    }

    async run(): Promise<void> {
        let step: PatientKitStep = new KitReplaceBeginPage();

        do {
            step = await step.visit(this.data);
        } while (step != null);
    }
}