import { by, EAF, EF, element, logger, UserRole, utils } from '../../../../../utils';
import { Report, TableValidation } from '../../';

export class PatientVisitSummaryReport extends Report {

    id: string = "Patient Visit Summary Report";
    title: string = "SUBJECT_VISIT_REPORT_TITLE";

    async hasRequiredData(user: UserRole, data: {}, ) {

        switch (user) {
            case UserRole.roles.StudyManager:
                await utils.screenshot("pvsr-report-sm.png");
                return await this.displaysData(data);
            case UserRole.roles.CSL:
                await utils.screenshot("pvsr-report-csl.png");
                return await this.displaysData(data) &&
                    await this.isUnblinded();
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("pvsr-report-si.png");
                return await this.displaysData(data);
            default:
                logger.info("Couldn't match user in patient-visit-summary-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }

    async verifyColumnData(column): Promise<boolean> {
        let index: number = await this.getColumnIndex(column);
        let rows: EAF = element.all(by.xpath(".//tbody//tr"));
        let verifyData: string[] = [
            "reiterator-reA",
            "refactorer-reB"
        ]

        let notUndefined = async (column: string) => column !== null && verifyData.indexOf(column) !== -1;
        let getText = async (ele: EF): Promise<string> => await ele.getText();

        return TableValidation.validateColumn(rows, index, notUndefined, getText);
    }
}
