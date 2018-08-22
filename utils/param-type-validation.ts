import * as reports from '../pages/home/report';

export class CucumberParamTypeValidation {

    /**
     *  isReport() - Help debug issues for the 'report' cucumber parameter type.
     *  Verifys three conditions that are needed in order to create the 'report' type param:
     *  
     *  1.) the tested report page object file is imported correctly
     *  2.) the tested report class is an instance of the super class report
     *  3.) the tested report page object has the correct id field
     * 
     * @param className - to verify that the report class is imported correctly
     * @param id - to verify that the report has the correct id field
     */
    static isReport(className: string, id: string): boolean {
        let keys: string[] = Object.keys(reports);
        if (keys.indexOf(className) === -1)
            throw Error("Import Error: Failed to locate class in reports/index.ts file");

        try {
            let report: reports.Report = new reports[className]();
            let result: boolean = report instanceof reports.Report && report.constructor.name !== reports.Report.name;
            return result && this.hasReportId(report, id);
        } catch (e) {
            throw Error("Class Error: " + className + " is not an instance of the report super class");
        }
    }

    private static hasReportId(report: reports.Report, id: string): boolean {
        if (report.id === undefined && report.id !== id) {
            throw Error("Identification Error: the report id does not match the tested id: " + report.id + " !== " + id);
        }
        return true;
    }
}

