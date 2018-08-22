import { by, browser, element, EF, EAF, logger, TableDefinition, utils, UserRole, Report, waitText } from '../'

export class PatientListReport extends Report {
    
    id: string = "Patient Lists";

    headline: EF = element(by.css('.md-headline.prancer-title.ng-scope'));
    patientListsHomeHeading: EF = element(by.binding('SITE_DASHBOARD_PATIENTS_TITLE'));
    patientsListsReportHeading: EF = element(by.binding('PATIENTS_PATIENTS_LIST'));
    screenPatientButton: EF = element(by.buttonText("Screen a patient"));
    tableHeaderRow: EF = element.all(by.css('thead tr.md-row')).get(3);
    plrHeaderDiv: EF = element(by.css('[e2e-id="patient-header-panel"]'));
    tableBodyRows: EAF = element.all(by.xpath("(//tbody)[5]//tr"));

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition): Promise<boolean> {

        switch (user) {
            case UserRole.roles.CSL:
                await utils.screenshot("plr-report-csl.png");
                return await this.verifyMetaData(table) && await this.verifyTableData(data);
            case UserRole.roles.PrincipalInvestigator:
                await utils.screenshot("plr-report-si.png");
                return await this.verifyMetaData(table) && await this.displaysData(data, this.tableHeaderRows.get(0));
            default:
                logger.info("Couldn't match user in patient-lists-report:hasRequiredData(" + user.name + ")");
                return false;
        }
    }

    //checks table data on home page or patient list page
    private async verifyTableData(data: {}): Promise<boolean> {
        let url: string = await browser.getCurrentUrl();
        if (url.indexOf("/home") !== -1) {
            await browser.actions().mouseMove(this.plrHeaderDiv).perform();
            return await this.displaysData(data, this.tableHeaderRow) &&
                await this.patientListsHomeHeading.isDisplayed();
        }
        else
            return await this.displaysData(data, this.tableHeaderRows.get(0)) && await this.patientsListsReportHeading.isDisplayed() &&
                await this.screenPatientButton.isDisplayed();
    }


    //verifys the header table meta data
    async verifyMetaData(table: TableDefinition): Promise<boolean> {
        let headerTableArr: string[] = (await waitText(this.plrHeaderDiv)).split('\n');
        let tableHeadings: string[] = headerTableArr.splice(0, 2);
        let tableBodyHeaders: string[] = headerTableArr.splice(0, 6);
        let tableBodyData: string[] = headerTableArr;
        let tableMetaData: string[][] = table.rows().splice(2, table.rows().length);

        let counter = 0;
        for (let i = 0; i < tableMetaData.length; i++) {
            if (tableMetaData[i][0] !== tableBodyHeaders[i]) {
                logger.debug("verifyMetaData()-headers: " + tableMetaData[i][0] + "!==" + tableBodyHeaders[i]);
                counter++;
            }
            else if (tableMetaData[i][1] !== tableBodyData[i]) {
                logger.debug("verifyMetaData()-metaData: " + tableMetaData[i][1] + "!==" + tableBodyData[i]);
                counter++;
            }
        }

        return (counter == 0 && this.verifyHeadlineMetaData(tableHeadings, table));
    }

    //verifys header table title and sub title
    private async verifyHeadlineMetaData(headers: string[], table: TableDefinition): Promise<boolean> {
        let tableHeaders: string[][] = table.rows().splice(0, 2);
        let counter: number = 0;

        for (let i = 0; i < tableHeaders.length; i++) {
            if (tableHeaders[i][0] !== headers[i]) {
                logger.debug("verifyHeadlineMetaData(): " + tableHeaders[i][0] + "!==" + headers[i]);
                counter++;
            }
        }

        return (counter == 0);
    }

}