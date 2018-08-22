import { by, element, waitText, utils, EAF, EF } from '../../../../utils';
import { TableDefinition } from 'cucumber';
import { logger } from '../../../../utils/logger';

import { UserRole } from '../../../../utils/user.role';
import { Report } from '../';

export class KitHistoryReport extends Report {

    id: string = "Kit History Report";
    title: string = "KIT_HISTORY_REPORT";
    
    searchFields: EAF = element.all(by.css('[placeholder="search"]'));
    statusHeaderField: EF = element.all(by.repeater("c in content_group")).last();
    kit_code: EF = element.all(by.css('[ng-repeat="(label, key) in header.header"]')).first();

    async getChangePerformedText(row: number = 0, index: number = 0): Promise<string> {
        let changePerformed = await this.rows().get(row).all(by.repeater("col in column_details")).get(index);
        return await waitText(changePerformed);
    }

    async hasRequiredData(user: UserRole, data: {}, table: TableDefinition) {

        await utils.screenshot("khr-report.png");

        switch (user) {
            case UserRole.roles.CSL:
                return await this.verifyMetaData(table) &&
                    await this.displaysData(data) &&
                    await this.isUnblinded();
        }
        return false;
    }

    async hasNoVisibleData(user: UserRole): Promise<boolean> {
        let result: boolean = await super.hasNoVisibleData();
        switch(user){
            case UserRole.roles.CSL:
                return result && this.isUnblinded();
            case UserRole.roles.StudyManager:
                return result;
            default:
                logger.debug('no user was selected for kit history report: hasNoVisibleData()');
                return result;
        }
    }
}