import { EF, TableDefinition } from '../';

export interface IReport {
    open(): Promise<boolean>;
    isVisible(): Promise<boolean>;
    displaysData(preparedData: {}, header: EF): Promise<boolean>;
    verifySiteCodes(obj: {}, s: string);
    verifyMetaData(table: TableDefinition):Promise<boolean>;
    displaysData(l: string): Promise<boolean>;
    downloadCSV(): Promise<void>;
    downloadPDF(): Promise<void>;
    selectDropDownValue(value: string): Promise<void>;
    advancePage(): Promise<number>;
    backPage(): Promise<number>;
    getReportDescription(): Promise<string>;
    validatePatientRowsInOrder(column: string): Promise<boolean>;
}
